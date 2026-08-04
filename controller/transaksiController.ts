import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { coreApi } from "../lib/midtrans";

// CREATE TRANSAKSI + CHARGE MIDTRANS
export const createTransaksi = async (req: Request, res: Response) => {
  try {
    const { nama_pemesan, no_wa, tanggal_sewa, durasi, lokasi, total_harga, id_mobil, qty, payment_method, bank } = req.body;

    if (!nama_pemesan || !no_wa || !tanggal_sewa || !durasi || !lokasi || !total_harga || !id_mobil || !payment_method) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // Cek unit tersedia
    const mobil = await prisma.mobil.findUnique({ where: { id_mobil: parseInt(id_mobil) } });
    if (!mobil) return res.status(404).json({ message: "Mobil tidak ditemukan" });
    if (mobil.unitTersedia < (qty || 1)) {
      return res.status(400).json({ message: "Unit tidak tersedia" });
    }

    const order_id = `PPS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Bangun parameter charge sesuai metode pembayaran
    let chargeParams: any = {
      payment_type: payment_method, // "bank_transfer" | "qris" | "gopay" | "shopeepay" | dll
      transaction_details: {
        order_id,
        gross_amount: parseInt(total_harga),
      },
      customer_details: {
        first_name: nama_pemesan,
        phone: no_wa,
      },
    };

    if (payment_method === "bank_transfer") {
      chargeParams.bank_transfer = { bank: bank || "bca" }; // bca | bni | bri | permata | cimb
    } else if (payment_method === "qris") {
      chargeParams = {
        payment_type: "qris",
        transaction_details: chargeParams.transaction_details,
        customer_details: chargeParams.customer_details,
        qris: { acquirer: "gopay" },
      };
    } else if (payment_method === "gopay" || payment_method === "shopeepay") {
      chargeParams.payment_type = payment_method;
      chargeParams[payment_method] = { enable_callback: false };
    }

    // Charge ke Midtrans
    const midtransRes = await coreApi.charge(chargeParams);

    // Ekstrak data pembayaran dari response
    let va_number: string | null = null;
    let bankName: string | null = null;
    let qr_url: string | null = null;

    if (midtransRes.va_numbers && midtransRes.va_numbers.length > 0) {
      va_number = midtransRes.va_numbers[0].va_number;
      bankName = midtransRes.va_numbers[0].bank;
    }
    if (midtransRes.permata_va_number) {
      va_number = midtransRes.permata_va_number;
      bankName = "permata";
    }
    if (midtransRes.actions) {
      const qrAction = midtransRes.actions.find((a: any) => a.name === "generate-qr-code");
      if (qrAction) qr_url = qrAction.url;
    }

    // Simpan transaksi ke DB
    const transaksi = await prisma.transaksi.create({
      data: {
        order_id,
        nama_pemesan,
        no_wa,
        tanggal_sewa: new Date(tanggal_sewa),
        durasi: parseInt(durasi),
        lokasi,
        total_harga: parseInt(total_harga),
        id_mobil: parseInt(id_mobil),
        qty: parseInt(qty) || 1,
        status: "pending",
        payment_type: midtransRes.payment_type,
        status_pembayaran: midtransRes.transaction_status || "pending",
        va_number,
        bank: bankName,
        qr_url,
        expiry_time: midtransRes.expiry_time ? new Date(midtransRes.expiry_time) : null,
      },
      include: { mobil: true },
    });

    // Kurangi unit tersedia
    const newUnitTersedia = mobil.unitTersedia - (qty || 1);
    await prisma.mobil.update({
      where: { id_mobil: parseInt(id_mobil) },
      data: {
        unitTersedia: newUnitTersedia,
        tersedia: newUnitTersedia > 0,
      },
    });

    return res.status(201).json({
      message: "Transaksi berhasil dibuat",
      transaksi,
      payment: {
        payment_type: midtransRes.payment_type,
        va_number,
        bank: bankName,
        qr_url,
        expiry_time: midtransRes.expiry_time,
      },
    });
  } catch (error: any) {
    console.error("CREATE TRANSAKSI ERROR:", error);
    return res.status(500).json({ message: "Server error", detail: error.message });
  }
};

// MIDTRANS WEBHOOK / NOTIFICATION HANDLER
export const midtransNotification = async (req: Request, res: Response) => {
  try {
    // Memperbaiki pemanggilan SDK Midtrans yang benar (transaction tanpa 's')
    const notification = await (coreApi as any).transaction.notification(req.body);

    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    const transaksi = await prisma.transaksi.findUnique({ where: { order_id: orderId } });
    if (!transaksi) return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    let statusPembayaran = transactionStatus;

    if (transactionStatus === "capture" || transactionStatus === "settlement") {
      if (fraudStatus === "accept" || !fraudStatus) {
        statusPembayaran = "settlement";
      }
    } else if (transactionStatus === "deny" || transactionStatus === "cancel" || transactionStatus === "expire") {
      statusPembayaran = transactionStatus;

      // Kembalikan unit kalau pembayaran gagal/batal/expired (Mencegah pengembalian ganda jika status sebelumnya sudah batal)
      if (transaksi.status_pembayaran !== "cancel" && transaksi.status_pembayaran !== "expire" && transaksi.status_pembayaran !== "deny") {
        await prisma.mobil.update({
          where: { id_mobil: transaksi.id_mobil },
          data: {
            unitTersedia: { increment: transaksi.qty },
            tersedia: true,
          },
        });
      }
    }

    await prisma.transaksi.update({
      where: { order_id: orderId },
      data: {
        status_pembayaran: statusPembayaran,
        // Kalau pembayaran settlement, status pesanan otomatis konfirmasi
        status: statusPembayaran === "settlement" ? "konfirmasi" : transaksi.status,
      },
    });

    return res.status(200).json({ message: "OK" });
  } catch (error: any) {
    console.error("MIDTRANS NOTIFICATION ERROR:", error);
    return res.status(500).json({ message: "Server error", detail: error.message });
  }
};

// CHECK STATUS PEMBAYARAN (untuk polling dari frontend)
export const checkPaymentStatus = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.order_id as string;

    const transaksi = await prisma.transaksi.findUnique({ where: { order_id: orderId } });
    if (!transaksi) return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    // FIX UTAMA: Ubah transactions menjadi transaction (tanpa s)
    const status = await (coreApi as any).transaction.status(orderId);

    if (status && status.transaction_status !== transaksi.status_pembayaran) {
      let statusPembayaran = status.transaction_status;
      if (status.transaction_status === "capture" || status.transaction_status === "settlement") {
        statusPembayaran = "settlement";
      }

      await prisma.transaksi.update({
        where: { order_id: orderId },
        data: {
          status_pembayaran: statusPembayaran,
          status: statusPembayaran === "settlement" ? "konfirmasi" : transaksi.status,
        },
      });

      return res.json({ status_pembayaran: statusPembayaran });
    }

    return res.json({ status_pembayaran: transaksi.status_pembayaran });
  } catch (error: any) {
    // Kalau transaksi belum masuk ke database midtrans sama sekali, biarkan kembalikan status dari DB lokal
    console.error("CHECK STATUS ERROR:", error.message);
    const transaksi = await prisma.transaksi.findUnique({ where: { order_id: req.params.order_id } });
    return res.json({ status_pembayaran: transaksi?.status_pembayaran || "pending" });
  }
};

// GET ALL TRANSAKSI
export const getAllTransaksi = async (_req: Request, res: Response) => {
  try {
    const transaksis = await prisma.transaksi.findMany({
      orderBy: { createdAt: "desc" },
      include: { mobil: true },
    });
    return res.json({ transaksis });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE STATUS PESANAN (admin)
export const updateStatusTransaksi = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { status } = req.body;

    const validStatus = ["pending", "konfirmasi", "selesai"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const existing = await prisma.transaksi.findUnique({ where: { id_transaksi: id } });
    if (!existing) return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    if (status === "selesai" && existing.status !== "selesai") {
      await prisma.mobil.update({
        where: { id_mobil: existing.id_mobil },
        data: {
          unitTersedia: { increment: existing.qty },
          tersedia: true,
        },
      });
    }

    const transaksi = await prisma.transaksi.update({
      where: { id_transaksi: id },
      data: { status },
      include: { mobil: true },
    });

    return res.json({ message: "Status berhasil diupdate", transaksi });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE TRANSAKSI
export const deleteTransaksi = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    const existing = await prisma.transaksi.findUnique({ where: { id_transaksi: id } });
    if (!existing) return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    if (existing.status !== "selesai") {
      await prisma.mobil.update({
        where: { id_mobil: existing.id_mobil },
        data: {
          unitTersedia: { increment: existing.qty },
          tersedia: true,
        },
      });
    }

    await prisma.transaksi.delete({ where: { id_transaksi: id } });
    return res.json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
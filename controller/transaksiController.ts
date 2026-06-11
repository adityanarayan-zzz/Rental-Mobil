import { Request, Response } from "express";
import prisma from "../lib/prisma";

// CREATE TRANSAKSI
export const createTransaksi = async (req: Request, res: Response) => {
  try {
    const { nama_pemesan, no_wa, tanggal_sewa, durasi, lokasi, total_harga, id_mobil, qty } = req.body;

    if (!nama_pemesan || !no_wa || !tanggal_sewa || !durasi || !lokasi || !total_harga || !id_mobil) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // Cek unit tersedia
    const mobil = await prisma.mobil.findUnique({ where: { id_mobil: parseInt(id_mobil) } });
    if (!mobil) return res.status(404).json({ message: "Mobil tidak ditemukan" });
    if (mobil.unitTersedia < (qty || 1)) {
      return res.status(400).json({ message: "Unit tidak tersedia" });
    }

    // Buat transaksi
    const transaksi = await prisma.transaksi.create({
      data: {
        nama_pemesan,
        no_wa,
        tanggal_sewa: new Date(tanggal_sewa),
        durasi: parseInt(durasi),
        lokasi,
        total_harga: parseInt(total_harga),
        id_mobil: parseInt(id_mobil),
        qty: parseInt(qty) || 1,
        status: "pending",
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

    return res.status(201).json({ message: "Transaksi berhasil dibuat", transaksi });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
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

// UPDATE STATUS
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

    // Kalau selesai, kembalikan unit
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

    // Kembalikan unit kalau belum selesai
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
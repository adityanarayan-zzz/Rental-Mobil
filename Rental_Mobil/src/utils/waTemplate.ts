// Utility untuk generate template pesan WhatsApp konfirmasi pembayaran

interface WaTemplateParams {
  nama: string;
  noWa: string;
  namaMobil: string;
  qty: number;
  tanggalSewa: string; // format ISO atau readable
  durasi: number;
  lokasi: string;
  totalHarga: number;
  orderId: string;
}

export function generateWaMessage(params: WaTemplateParams): string {
  const {
    nama,
    namaMobil,
    qty,
    tanggalSewa,
    durasi,
    lokasi,
    totalHarga,
    orderId,
  } = params;

  const tanggalFormatted = new Date(tanggalSewa).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const totalFormatted = `Rp ${totalHarga.toLocaleString("id-ID")}`;

  const message = `Halo *${nama}*! 👋

Terima kasih telah melakukan pembayaran dan penyewaan di *PPS Rental Mobil*. Pesanan kamu sudah kami terima dan konfirmasi. 🚗✅

*Rincian Pesanan*
📋 Order ID: ${orderId}
🚘 Kendaraan: ${namaMobil} (${qty} unit)
📅 Tanggal Sewa: ${tanggalFormatted}
⏱️ Durasi: ${durasi} hari
📍 Lokasi Penjemputan: ${lokasi}
🧑‍✈️ Layanan: Termasuk Driver
💰 Total Pembayaran: ${totalFormatted}

*Status Pembayaran: LUNAS ✅*

Tim kami akan menghubungi kamu lebih lanjut untuk konfirmasi jadwal penjemputan. Jika ada pertanyaan, jangan ragu untuk membalas pesan ini.

Terima kasih telah mempercayakan perjalanan kamu bersama *PPS Rental Mobil*! 🙏`;

  return message;
}

// Generate URL wa.me siap pakai
export function generateWaLink(noWa: string, message: string): string {
  // Normalisasi nomor: hapus karakter non-digit, ganti awalan 0 jadi 62
  let cleanNumber = noWa.replace(/\D/g, "");
  if (cleanNumber.startsWith("0")) {
    cleanNumber = "62" + cleanNumber.slice(1);
  } else if (!cleanNumber.startsWith("62")) {
    cleanNumber = "62" + cleanNumber;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}
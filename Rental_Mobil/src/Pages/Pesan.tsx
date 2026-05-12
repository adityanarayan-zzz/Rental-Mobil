import { useState } from "react";

const cars = [
  {
    id: 1,
    name: "Toyota Avanza",
    type: "MPV Keluarga",
    image: "/src/assets/avanza.png",
    price: 300000,
    seats: 7,
  },
  {
    id: 2,
    name: "Toyota Innova",
    type: "MPV Premium",
    image: "/src/assets/innova.jpeg",
    price: 450000,
    seats: 7,
  },
];

const paymentMethods = [
  {
    id: "bca",
    label: "BCA",
    type: "bank",
    icon: "🏦",
    detail: "1234567890",
    name: "PT PPS Rental Car",
  },
  {
    id: "bni",
    label: "BNI",
    type: "bank",
    icon: "🏦",
    detail: "0987654321",
    name: "PT PPS Rental Car",
  },
  {
    id: "mandiri",
    label: "Mandiri",
    type: "bank",
    icon: "🏦",
    detail: "1122334455",
    name: "PT PPS Rental Car",
  },
  {
    id: "qris",
    label: "QRIS",
    type: "qris",
    icon: "▦",
    detail: "",
    name: "",
  },
  {
    id: "ovo",
    label: "OVO",
    type: "ewallet",
    icon: "💜",
    detail: "08123456789",
    name: "PPS Rental",
  },
  {
    id: "gopay",
    label: "GoPay",
    type: "ewallet",
    icon: "💙",
    detail: "08123456789",
    name: "PPS Rental",
  },
  {
    id: "dana",
    label: "DANA",
    type: "ewallet",
    icon: "💛",
    detail: "08123456789",
    name: "PPS Rental",
  },
];

type Step = "form" | "payment" | "success";

export default function Pesan() {
  const [step, setStep] = useState<Step>("form");
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [withDriver, setWithDriver] = useState(false);
  const [durasi, setDurasi] = useState(1);
  const [nama, setNama] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const car = cars.find((c) => c.id === selectedCar);
  const total = car ? car.price * durasi : 0;
  const method = paymentMethods.find((m) => m.id === selectedPayment);

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function resetAll() {
    setStep("form");
    setSelectedCar(null);
    setWithDriver(false);
    setDurasi(1);
    setNama("");
    setTanggal("");
    setLokasi("");
    setSelectedPayment(null);
  }

  // SUCCESS
  if (step === "success") {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; }
          .pesan-page { font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; background: #f8f9ff; padding-top: 64px; display: flex; align-items: center; justify-content: center; }
          .success-card { background: #fff; border-radius: 24px; padding: 3rem; text-align: center; max-width: 440px; width: 100%; box-shadow: 0 16px 48px rgba(26,63,168,0.12); margin: 2rem; }
          .success-icon { width: 72px; height: 72px; background: linear-gradient(135deg, #1a3fa8, #8b3cc4); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 32px; color: #fff; }
          .success-card h2 { font-size: 1.5rem; font-weight: 800; color: #1a1a2e; margin: 0 0 8px; }
          .success-card > p { font-size: 14px; color: #888; margin: 0 0 1.5rem; line-height: 1.6; }
          .success-detail { background: #f8f9ff; border-radius: 12px; padding: 1rem 1.25rem; text-align: left; margin-bottom: 1.5rem; }
          .success-detail-row { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px solid #eef0f8; }
          .success-detail-row:last-child { border-bottom: none; }
          .success-detail-row span { color: #888; }
          .success-detail-row strong { color: #1a1a2e; }
          .btn-back { background: linear-gradient(135deg, #1a3fa8, #8b3cc4); color: #fff; border: none; border-radius: 12px; padding: 13px 28px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; width: 100%; }
        `}</style>
        <div className="pesan-page">
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h2>Pembayaran Dikonfirmasi!</h2>
            <p>Pesanan kamu sedang diproses. Tim kami akan menghubungi kamu segera.</p>
            <div className="success-detail">
              <div className="success-detail-row"><span>Nama</span><strong>{nama}</strong></div>
              <div className="success-detail-row"><span>Mobil</span><strong>{car?.name}</strong></div>
              <div className="success-detail-row"><span>Tanggal</span><strong>{tanggal}</strong></div>
              <div className="success-detail-row"><span>Durasi</span><strong>{durasi} hari</strong></div>
              {withDriver && <div className="success-detail-row"><span>Lokasi Jemput</span><strong>{lokasi}</strong></div>}
              <div className="success-detail-row"><span>Metode Bayar</span><strong>{method?.label}</strong></div>
              <div className="success-detail-row"><span>Total Bayar</span><strong>Rp {total.toLocaleString("id-ID")}</strong></div>
            </div>
            <button className="btn-back" onClick={resetAll}>Buat Pesanan Baru</button>
          </div>
        </div>
      </>
    );
  }

  // PAYMENT
  if (step === "payment") {
    const banks = paymentMethods.filter((m) => m.type === "bank");
    const ewallets = paymentMethods.filter((m) => m.type === "ewallet");

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; }
          .pesan-page { font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; background: #f8f9ff; padding-top: 64px; }
          .pesan-header { background: linear-gradient(135deg, #1a3fa8 0%, #3b5fd4 30%, #8b3cc4 65%, #c0392b 100%); padding: 3rem 6rem 4rem; position: relative; overflow: hidden; }
          .pesan-header::before { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%); pointer-events: none; }
          .pesan-header h1 { font-size: 2.2rem; font-weight: 800; color: #fff; margin: 0 0 8px; letter-spacing: -0.02em; position: relative; }
          .pesan-header p { font-size: 15px; color: rgba(255,255,255,0.7); margin: 0; position: relative; }
          .pay-body { padding: 2.5rem 6rem; display: grid; grid-template-columns: 1fr 360px; gap: 2rem; align-items: start; }
          .pay-left { display: flex; flex-direction: column; gap: 1.5rem; }
          .pay-section { background: #fff; border-radius: 20px; padding: 1.75rem; border: 1px solid rgba(26,63,168,0.08); }
          .pay-section-title { font-size: 14px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1rem; }
          .pay-method-group { display: flex; flex-direction: column; gap: 8px; }
          .pay-method { display: flex; align-items: center; gap: 12px; padding: 13px 14px; border: 2px solid #e0e4f0; border-radius: 12px; cursor: pointer; transition: border-color 0.2s, background 0.2s; background: #fafbff; }
          .pay-method:hover { border-color: rgba(26,63,168,0.3); background: #f0f4ff; }
          .pay-method.selected { border-color: #1a3fa8; background: rgba(26,63,168,0.04); }
          .pay-method-icon { width: 36px; height: 36px; border-radius: 10px; background: #f0f2f8; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
          .pay-method-label { flex: 1; font-size: 14px; font-weight: 600; color: #1a1a2e; }
          .pay-method-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #d0d4e8; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: border-color 0.2s; }
          .pay-method.selected .pay-method-radio { border-color: #1a3fa8; }
          .pay-method-radio-dot { width: 8px; height: 8px; border-radius: 50%; background: #1a3fa8; opacity: 0; transition: opacity 0.2s; }
          .pay-method.selected .pay-method-radio-dot { opacity: 1; }

          .pay-detail-box { background: #f8f9ff; border-radius: 14px; padding: 1.25rem; border: 1px solid rgba(26,63,168,0.08); }
          .pay-detail-label { font-size: 12px; color: #888; margin-bottom: 4px; }
          .pay-detail-number { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
          .pay-detail-number span { font-size: 20px; font-weight: 800; color: #1a1a2e; letter-spacing: 0.05em; }
          .btn-copy { background: linear-gradient(135deg, #1a3fa8, #8b3cc4); color: #fff; border: none; border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap; transition: opacity 0.2s; }
          .btn-copy:hover { opacity: 0.85; }
          .pay-detail-name { font-size: 13px; color: #555; margin-top: 6px; }

          .qris-box { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 1.5rem; }
          .qris-placeholder { width: 160px; height: 160px; background: linear-gradient(135deg, #e8eeff, #f0e8ff); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 64px; border: 2px dashed rgba(26,63,168,0.2); }
          .qris-note { font-size: 12px; color: #888; text-align: center; line-height: 1.5; }

          .pay-right { background: #fff; border-radius: 20px; padding: 1.75rem; border: 1px solid rgba(26,63,168,0.08); position: sticky; top: 84px; }
          .summary-title { font-size: 15px; font-weight: 700; color: #1a1a2e; margin: 0 0 1.25rem; }
          .summary-car { display: flex; gap: 12px; align-items: center; padding: 12px; background: #f8f9ff; border-radius: 12px; margin-bottom: 1.25rem; }
          .summary-car img { width: 64px; height: 44px; object-fit: contain; background: linear-gradient(135deg, #e8eeff, #f0e8ff); border-radius: 8px; }
          .summary-car-info strong { display: block; font-size: 13px; font-weight: 700; color: #1a1a2e; }
          .summary-car-info span { font-size: 12px; color: #888; }
          .summary-rows { display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.25rem; }
          .summary-row { display: flex; justify-content: space-between; font-size: 13px; }
          .summary-row span { color: #888; }
          .summary-row strong { color: #1a1a2e; font-weight: 600; }
          .summary-divider { height: 1px; background: #e0e4f0; margin: 4px 0; }
          .summary-total { display: flex; justify-content: space-between; align-items: center; padding: 14px; background: rgba(26,63,168,0.05); border-radius: 12px; margin-bottom: 1.25rem; }
          .summary-total span { font-size: 13px; color: #555; font-weight: 500; }
          .summary-total strong { font-size: 18px; font-weight: 800; color: #1a3fa8; }
          .btn-confirm-pay { background: linear-gradient(135deg, #1a3fa8 0%, #8b3cc4 100%); color: #fff; border: none; border-radius: 12px; padding: 14px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; width: 100%; transition: opacity 0.2s, transform 0.15s; box-shadow: 0 4px 16px rgba(26,63,168,0.28); }
          .btn-confirm-pay:hover { opacity: 0.9; transform: translateY(-1px); }
          .btn-confirm-pay:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
          .btn-back-form { background: none; border: 1.5px solid #e0e4f0; border-radius: 12px; padding: 11px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; width: 100%; color: #555; margin-top: 8px; transition: border-color 0.2s; }
          .btn-back-form:hover { border-color: #1a3fa8; color: #1a3fa8; }
          .pay-note { font-size: 11px; color: #aaa; text-align: center; margin-top: 10px; line-height: 1.5; }

          @media (max-width: 1024px) {
            .pay-body { grid-template-columns: 1fr; padding: 2rem; }
            .pesan-header { padding: 2rem; }
            .pay-right { position: static; }
          }
        `}</style>

        <div className="pesan-page">
          <div className="pesan-header">
            <h1>Pembayaran</h1>
            <p>Pilih metode pembayaran dan selesaikan transaksi kamu</p>
          </div>

          <div className="pay-body">
            <div className="pay-left">

              {/* Transfer Bank */}
              <div className="pay-section">
                <p className="pay-section-title">Transfer Bank</p>
                <div className="pay-method-group">
                  {banks.map((m) => (
                    <div
                      key={m.id}
                      className={`pay-method${selectedPayment === m.id ? " selected" : ""}`}
                      onClick={() => setSelectedPayment(m.id)}
                    >
                      <div className="pay-method-icon">🏦</div>
                      <span className="pay-method-label">Bank {m.label}</span>
                      <div className="pay-method-radio">
                        <div className="pay-method-radio-dot" />
                      </div>
                    </div>
                  ))}
                </div>
                {method?.type === "bank" && (
                  <div style={{ marginTop: "1rem" }}>
                    <div className="pay-detail-box">
                      <p className="pay-detail-label">Nomor Rekening Bank {method.label}</p>
                      <div className="pay-detail-number">
                        <span>{method.detail}</span>
                        <button className="btn-copy" onClick={() => handleCopy(method.detail)}>
                          {copied ? "Tersalin!" : "Salin"}
                        </button>
                      </div>
                      <p className="pay-detail-name">a.n. {method.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* QRIS */}
              <div className="pay-section">
                <p className="pay-section-title">QRIS</p>
                <div
                  className={`pay-method${selectedPayment === "qris" ? " selected" : ""}`}
                  onClick={() => setSelectedPayment("qris")}
                >
                  <div className="pay-method-icon">▦</div>
                  <span className="pay-method-label">QRIS (Semua Aplikasi)</span>
                  <div className="pay-method-radio">
                    <div className="pay-method-radio-dot" />
                  </div>
                </div>
                {selectedPayment === "qris" && (
                  <div className="qris-box">
                    <div className="qris-placeholder">▦</div>
                    <p className="qris-note">Scan QR code ini menggunakan aplikasi pembayaran apapun.<br />QR Code akan tersedia setelah integrasi Midtrans.</p>
                  </div>
                )}
              </div>

              {/* E-Wallet */}
              <div className="pay-section">
                <p className="pay-section-title">E-Wallet</p>
                <div className="pay-method-group">
                  {ewallets.map((m) => (
                    <div
                      key={m.id}
                      className={`pay-method${selectedPayment === m.id ? " selected" : ""}`}
                      onClick={() => setSelectedPayment(m.id)}
                    >
                      <div className="pay-method-icon">{m.icon}</div>
                      <span className="pay-method-label">{m.label}</span>
                      <div className="pay-method-radio">
                        <div className="pay-method-radio-dot" />
                      </div>
                    </div>
                  ))}
                </div>
                {method?.type === "ewallet" && (
                  <div style={{ marginTop: "1rem" }}>
                    <div className="pay-detail-box">
                      <p className="pay-detail-label">Nomor {method.label}</p>
                      <div className="pay-detail-number">
                        <span>{method.detail}</span>
                        <button className="btn-copy" onClick={() => handleCopy(method.detail)}>
                          {copied ? "Tersalin!" : "Salin"}
                        </button>
                      </div>
                      <p className="pay-detail-name">a.n. {method.name}</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Ringkasan */}
            <div className="pay-right">
              <p className="summary-title">Ringkasan Pesanan</p>
              <div className="summary-car">
                {car && <img src={car.image} alt={car.name} />}
                <div className="summary-car-info">
                  <strong>{car?.name}</strong>
                  <span>{car?.type}</span>
                </div>
              </div>
              <div className="summary-rows">
                <div className="summary-row"><span>Nama</span><strong>{nama}</strong></div>
                <div className="summary-row"><span>Tanggal</span><strong>{tanggal}</strong></div>
                <div className="summary-row"><span>Durasi</span><strong>{durasi} hari</strong></div>
                <div className="summary-row"><span>Driver</span><strong>{withDriver ? "Ya" : "Tidak"}</strong></div>
                {withDriver && <div className="summary-row"><span>Lokasi Jemput</span><strong>{lokasi}</strong></div>}
                <div className="summary-divider" />
                <div className="summary-row"><span>Harga/hari</span><strong>Rp {car?.price.toLocaleString("id-ID")}</strong></div>
              </div>
              <div className="summary-total">
                <span>Total Bayar</span>
                <strong>Rp {total.toLocaleString("id-ID")}</strong>
              </div>
              <button
                className="btn-confirm-pay"
                disabled={!selectedPayment}
                onClick={() => setStep("success")}
              >
                Bayar Sekarang
              </button>
              <button className="btn-back-form" onClick={() => setStep("form")}>
                ← Kembali ke Form
              </button>
              <p className="pay-note">Pembayaran akan diverifikasi otomatis setelah integrasi Midtrans aktif</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // FORM
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }

        .pesan-page { font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; background: #f8f9ff; padding-top: 64px; }
        .pesan-header { background: linear-gradient(135deg, #1a3fa8 0%, #3b5fd4 30%, #8b3cc4 65%, #c0392b 100%); padding: 3rem 6rem 4rem; position: relative; overflow: hidden; }
        .pesan-header::before { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%); pointer-events: none; }
        .pesan-header h1 { font-size: 2.2rem; font-weight: 800; color: #fff; margin: 0 0 8px; letter-spacing: -0.02em; position: relative; }
        .pesan-header p { font-size: 15px; color: rgba(255,255,255,0.7); margin: 0; position: relative; }

        .pesan-body { padding: 2.5rem 6rem; display: grid; grid-template-columns: 1fr 380px; gap: 2rem; align-items: start; }
        .pesan-form-wrap { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-section { background: #fff; border-radius: 20px; padding: 1.75rem; border: 1px solid rgba(26,63,168,0.08); }
        .form-section-title { font-size: 15px; font-weight: 700; color: #1a1a2e; margin: 0 0 1.25rem; display: flex; align-items: center; gap: 8px; }
        .form-section-title span { width: 28px; height: 28px; background: linear-gradient(135deg, #1a3fa8, #8b3cc4); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #fff; font-weight: 700; flex-shrink: 0; }

        .car-options { display: flex; flex-direction: column; gap: 10px; }
        .car-option { display: flex; align-items: center; gap: 14px; padding: 14px; border: 2px solid #e0e4f0; border-radius: 14px; cursor: pointer; transition: border-color 0.2s, background 0.2s; background: #fafbff; }
        .car-option:hover { border-color: rgba(26,63,168,0.3); background: #f0f4ff; }
        .car-option.selected { border-color: #1a3fa8; background: rgba(26,63,168,0.04); }
        .car-option-img { width: 80px; height: 56px; object-fit: contain; background: linear-gradient(135deg, #e8eeff, #f0e8ff); border-radius: 10px; flex-shrink: 0; }
        .car-option-info { flex: 1; }
        .car-option-info strong { display: block; font-size: 14px; font-weight: 700; color: #1a1a2e; margin-bottom: 2px; }
        .car-option-info span { font-size: 12px; color: #888; }
        .car-option-price { font-size: 14px; font-weight: 700; color: #1a3fa8; white-space: nowrap; }
        .car-option-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #d0d4e8; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: border-color 0.2s; }
        .car-option.selected .car-option-radio { border-color: #1a3fa8; }
        .car-option-radio-dot { width: 8px; height: 8px; border-radius: 50%; background: #1a3fa8; opacity: 0; transition: opacity 0.2s; }
        .car-option.selected .car-option-radio-dot { opacity: 1; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field.full { grid-column: 1 / -1; }
        .form-field label { font-size: 13px; font-weight: 600; color: #444; }
        .form-input { padding: 11px 14px; border: 1.5px solid #e0e4f0; border-radius: 10px; font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif; color: #1a1a2e; background: #f8f9ff; transition: border-color 0.2s, box-shadow 0.2s; outline: none; width: 100%; }
        .form-input:focus { border-color: #1a3fa8; background: #fff; box-shadow: 0 0 0 3px rgba(26,63,168,0.08); }
        .form-input::placeholder { color: #bbb; }

        .durasi-wrap { display: flex; align-items: center; gap: 12px; }
        .durasi-btn { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid #e0e4f0; background: #f8f9ff; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #1a3fa8; font-weight: 700; transition: background 0.15s, border-color 0.15s; flex-shrink: 0; }
        .durasi-btn:hover { background: rgba(26,63,168,0.08); border-color: #1a3fa8; }
        .durasi-value { font-size: 16px; font-weight: 700; color: #1a1a2e; min-width: 60px; text-align: center; }

        .driver-toggle { display: flex; align-items: center; justify-content: space-between; padding: 14px; background: #f8f9ff; border-radius: 12px; border: 1.5px solid #e0e4f0; cursor: pointer; transition: border-color 0.2s; }
        .driver-toggle.active { border-color: #1a3fa8; background: rgba(26,63,168,0.04); }
        .driver-toggle-info strong { display: block; font-size: 14px; font-weight: 600; color: #1a1a2e; }
        .driver-toggle-info span { font-size: 12px; color: #888; }
        .toggle-switch { width: 44px; height: 24px; background: #d0d4e8; border-radius: 12px; position: relative; transition: background 0.2s; flex-shrink: 0; }
        .toggle-switch.on { background: #1a3fa8; }
        .toggle-knob { width: 18px; height: 18px; background: #fff; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: transform 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.15); }
        .toggle-switch.on .toggle-knob { transform: translateX(20px); }

        .pesan-summary { background: #fff; border-radius: 20px; padding: 1.75rem; border: 1px solid rgba(26,63,168,0.08); position: sticky; top: 84px; }
        .summary-title { font-size: 15px; font-weight: 700; color: #1a1a2e; margin: 0 0 1.25rem; }
        .summary-car { display: flex; gap: 12px; align-items: center; padding: 12px; background: #f8f9ff; border-radius: 12px; margin-bottom: 1.25rem; }
        .summary-car img { width: 64px; height: 44px; object-fit: contain; background: linear-gradient(135deg, #e8eeff, #f0e8ff); border-radius: 8px; }
        .summary-car-placeholder { width: 64px; height: 44px; background: linear-gradient(135deg, #e8eeff, #f0e8ff); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .summary-car-info strong { display: block; font-size: 13px; font-weight: 700; color: #1a1a2e; }
        .summary-car-info span { font-size: 12px; color: #888; }
        .summary-rows { display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.25rem; }
        .summary-row { display: flex; justify-content: space-between; font-size: 13px; }
        .summary-row span { color: #888; }
        .summary-row strong { color: #1a1a2e; font-weight: 600; }
        .summary-divider { height: 1px; background: #e0e4f0; margin: 4px 0; }
        .summary-total { display: flex; justify-content: space-between; align-items: center; padding: 14px; background: rgba(26,63,168,0.05); border-radius: 12px; margin-bottom: 1.25rem; }
        .summary-total span { font-size: 13px; color: #555; font-weight: 500; }
        .summary-total strong { font-size: 18px; font-weight: 800; color: #1a3fa8; }
        .btn-pesan-submit { background: linear-gradient(135deg, #1a3fa8 0%, #8b3cc4 100%); color: #fff; border: none; border-radius: 12px; padding: 14px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; width: 100%; transition: opacity 0.2s, transform 0.15s; box-shadow: 0 4px 16px rgba(26,63,168,0.28); }
        .btn-pesan-submit:hover { opacity: 0.9; transform: translateY(-1px); }
        .btn-pesan-submit:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
        .summary-note { font-size: 11px; color: #aaa; text-align: center; margin-top: 10px; line-height: 1.5; }

        @media (max-width: 1024px) {
          .pesan-body { grid-template-columns: 1fr; padding: 2rem; }
          .pesan-header { padding: 2rem; }
          .pesan-summary { position: static; }
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="pesan-page">
        <div className="pesan-header">
          <h1>Pesan Kendaraan</h1>
          <p>Isi data pemesanan dan pilih kendaraan yang kamu inginkan</p>
        </div>

        <div className="pesan-body">
          <div className="pesan-form-wrap">

            <div className="form-section">
              <div className="form-section-title"><span>1</span>Pilih Kendaraan</div>
              <div className="car-options">
                {cars.map((c) => (
                  <div key={c.id} className={`car-option${selectedCar === c.id ? " selected" : ""}`} onClick={() => setSelectedCar(c.id)}>
                    <img src={c.image} alt={c.name} className="car-option-img" />
                    <div className="car-option-info">
                      <strong>{c.name}</strong>
                      <span>{c.type} · {c.seats} Kursi</span>
                    </div>
                    <div className="car-option-price">
                      Rp {c.price.toLocaleString("id-ID")}<small style={{ fontWeight: 400, fontSize: 11, color: "#888" }}>/hari</small>
                    </div>
                    <div className="car-option-radio"><div className="car-option-radio-dot" /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title"><span>2</span>Data Pemesan</div>
              <div className="form-grid">
                <div className="form-field full">
                  <label>Nama Lengkap</label>
                  <input className="form-input" type="text" placeholder="Masukkan nama lengkap" value={nama} onChange={(e) => setNama(e.target.value)} />
                </div>
                <div className="form-field">
                  <label>Tanggal Sewa</label>
                  <input className="form-input" type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="form-field">
                  <label>Durasi Peminjaman</label>
                  <div className="durasi-wrap">
                    <button className="durasi-btn" onClick={() => setDurasi(Math.max(1, durasi - 1))}>−</button>
                    <span className="durasi-value">{durasi} hari</span>
                    <button className="durasi-btn" onClick={() => setDurasi(durasi + 1)}>+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title"><span>3</span>Layanan Driver</div>
              <div className={`driver-toggle${withDriver ? " active" : ""}`} onClick={() => setWithDriver(!withDriver)}>
                <div className="driver-toggle-info">
                  <strong>Sewa dengan Driver</strong>
                </div>
                <div className={`toggle-switch${withDriver ? " on" : ""}`}>
                  <div className="toggle-knob" />
                </div>
              </div>
              {withDriver && (
                <div className="form-field" style={{ marginTop: "14px" }}>
                  <label>Lokasi Penjemputan</label>
                  <input className="form-input" type="text" placeholder="Masukkan alamat penjemputan" value={lokasi} onChange={(e) => setLokasi(e.target.value)} />
                </div>
              )}
            </div>

          </div>

          <div className="pesan-summary">
            <p className="summary-title">Ringkasan Pesanan</p>
            <div className="summary-car">
              {car ? <img src={car.image} alt={car.name} /> : <div className="summary-car-placeholder">🚗</div>}
              <div className="summary-car-info">
                <strong>{car ? car.name : "Belum dipilih"}</strong>
                <span>{car ? car.type : "Pilih kendaraan dulu"}</span>
              </div>
            </div>
            <div className="summary-rows">
              <div className="summary-row"><span>Nama</span><strong>{nama || "-"}</strong></div>
              <div className="summary-row"><span>Tanggal</span><strong>{tanggal || "-"}</strong></div>
              <div className="summary-row"><span>Durasi</span><strong>{durasi} hari</strong></div>
              <div className="summary-row"><span>Driver</span><strong>{withDriver ? "Ya" : "Tidak"}</strong></div>
              {withDriver && <div className="summary-row"><span>Lokasi Jemput</span><strong>{lokasi || "-"}</strong></div>}
              <div className="summary-divider" />
              <div className="summary-row"><span>Harga/hari</span><strong>{car ? `Rp ${car.price.toLocaleString("id-ID")}` : "-"}</strong></div>
            </div>
            <div className="summary-total">
              <span>Total Estimasi</span>
              <strong>{car ? `Rp ${total.toLocaleString("id-ID")}` : "Rp 0"}</strong>
            </div>
            <button
              className="btn-pesan-submit"
              disabled={!selectedCar || !nama || !tanggal || (withDriver && !lokasi)}
              onClick={() => setStep("payment")}
            >
              Lanjut ke Pembayaran →
            </button>
            <p className="summary-note">Tim kami akan menghubungi kamu untuk konfirmasi lebih lanjut</p>
          </div>
        </div>
      </div>
    </>
  );
}
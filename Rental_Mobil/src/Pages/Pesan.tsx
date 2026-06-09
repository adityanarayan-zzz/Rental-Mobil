import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Mobil {
  id: number;
  name: string;
  type: string;
  image: string;
  price: number;
  seats: number;
}

interface MobilAPI {
  id_mobil: number;
  nama: string;
  tipe: string;
  harga: number;
  kursi: number;
  totalUnit: number;
  unitTersedia: number;
  gambar?: string;
  tersedia: boolean;
}

interface PesananMobil {
  mobil: Mobil;
  qty: number;
}

type Step = "form" | "payment" | "success";

const DRIVER_FEE_PER_HARI = 500000;

export default function Pesan() {
  const location = useLocation();
  const navigate = useNavigate();
  const mobilDariDaftar = location.state?.mobil as Mobil | undefined;

  const [step, setStep] = useState<Step>("form");
  const [pesananList, setPesananList] = useState<PesananMobil[]>(
    mobilDariDaftar ? [{ mobil: mobilDariDaftar, qty: 1 }] : []
  );
  const [durasi, setDurasi] = useState(1);
  const [nama, setNama] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [noWa, setNoWa] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAddMobil, setShowAddMobil] = useState(false);
  const [availableCars, setAvailableCars] = useState<Mobil[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);

  // Driver selalu include
  const driverFee = DRIVER_FEE_PER_HARI * durasi;
  const mobilTotal = pesananList.reduce((acc, p) => acc + p.mobil.price * p.qty * durasi, 0);
  const total = mobilTotal + driverFee;

  async function fetchAvailableCars() {
    setLoadingCars(true);
    try {
      const res = await fetch("http://localhost:3000/api/mobil");
      const data = await res.json();
      const mapped: Mobil[] = (data.mobils as MobilAPI[])
        .filter((m) => m.tersedia && m.unitTersedia > 0)
        .map((m) => ({
          id: m.id_mobil,
          name: m.nama,
          type: m.tipe,
          image: m.gambar || "",
          price: m.harga,
          seats: m.kursi,
        }));
      setAvailableCars(mapped);
    } catch {
      console.error("Gagal fetch mobil");
    } finally {
      setLoadingCars(false);
    }
  }

  function openAddMobil() {
    setShowAddMobil(true);
    fetchAvailableCars();
  }

  function addMobil(mobil: Mobil) {
    const existing = pesananList.find((p) => p.mobil.id === mobil.id);
    if (existing) {
      setPesananList(pesananList.map((p) => p.mobil.id === mobil.id ? { ...p, qty: p.qty + 1 } : p));
    } else {
      setPesananList([...pesananList, { mobil, qty: 1 }]);
    }
    setShowAddMobil(false);
  }

  function removeMobil(id: number) {
    setPesananList(pesananList.filter((p) => p.mobil.id !== id));
  }

  function updateQty(id: number, delta: number) {
    setPesananList(pesananList.map((p) => {
      if (p.mobil.id !== id) return p;
      const newQty = p.qty + delta;
      if (newQty <= 0) return p;
      return { ...p, qty: newQty };
    }));
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function resetAll() {
    setStep("form");
    setPesananList([]);
    setNama("");
    setTanggal("");
    setLokasi("");
    setDurasi(1);
    setSelectedPayment(null);
    setNoWa("");
  }

  const paymentMethods = [
    { id: "bca", label: "BCA", type: "bank", icon: "🏦", detail: "1234567890", name: "PT PPS Rental Car" },
    { id: "bni", label: "BNI", type: "bank", icon: "🏦", detail: "0987654321", name: "PT PPS Rental Car" },
    { id: "mandiri", label: "Mandiri", type: "bank", icon: "🏦", detail: "1122334455", name: "PT PPS Rental Car" },
    { id: "qris", label: "QRIS", type: "qris", icon: "▦", detail: "", name: "" },
    { id: "ovo", label: "OVO", type: "ewallet", icon: "💜", detail: "08123456789", name: "PPS Rental" },
    { id: "gopay", label: "GoPay", type: "ewallet", icon: "💙", detail: "08123456789", name: "PPS Rental" },
    { id: "dana", label: "DANA", type: "ewallet", icon: "💛", detail: "08123456789", name: "PPS Rental" },
  ];

  const method = paymentMethods.find((m) => m.id === selectedPayment);

  // ── SUCCESS ──────────────────────────────────────────────
  if (step === "success") {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; }
          .pesan-page { font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; background: #f8f9ff; padding-top: 64px; display: flex; align-items: center; justify-content: center; }
          .success-card { background: #fff; border-radius: 24px; padding: 3rem; text-align: center; max-width: 480px; width: 100%; box-shadow: 0 16px 48px rgba(26,63,168,0.12); margin: 2rem; }
          .success-icon { width: 72px; height: 72px; background: linear-gradient(135deg, #1a3fa8, #8b3cc4); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 32px; color: #fff; }
          .success-card h2 { font-size: 1.5rem; font-weight: 800; color: #1a1a2e; margin: 0 0 8px; }
          .success-card > p { font-size: 14px; color: #888; margin: 0 0 1.5rem; line-height: 1.6; }
          .success-detail { background: #f8f9ff; border-radius: 12px; padding: 1rem 1.25rem; text-align: left; margin-bottom: 1.5rem; }
          .success-detail-row { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; border-bottom: 1px solid #eef0f8; }
          .success-detail-row:last-child { border-bottom: none; }
          .success-detail-row span { color: #888; }
          .success-detail-row strong { color: #1a1a2e; }
          .btn-back { background: linear-gradient(135deg, #1a3fa8, #8b3cc4); color: #fff; border: none; border-radius: 12px; padding: 13px 28px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; width: 100%; margin-bottom: 8px; }
          .btn-back-daftar { background: none; border: 1.5px solid #e0e4f0; border-radius: 12px; padding: 11px 28px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; width: 100%; color: #555; }
        `}</style>
        <div className="pesan-page">
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h2>Pembayaran Dikonfirmasi!</h2>
            <p>Pesanan kamu sedang diproses. Tim kami akan menghubungi kamu segera.</p>
            <div className="success-detail">
              <div className="success-detail-row"><span>Nama</span><strong>{nama}</strong></div>
              <div className="success-detail-row"><span>No. WhatsApp</span><strong>{noWa}</strong></div>
              {pesananList.map((p) => (
                <div className="success-detail-row" key={p.mobil.id}>
                  <span>{p.mobil.name}</span>
                  <strong>{p.qty} unit × Rp {p.mobil.price.toLocaleString("id-ID")}</strong>
                </div>
              ))}
              <div className="success-detail-row"><span>Tanggal</span><strong>{tanggal}</strong></div>
              <div className="success-detail-row"><span>Durasi</span><strong>{durasi} hari</strong></div>
              <div className="success-detail-row"><span>Driver</span><strong>Termasuk</strong></div>
              <div className="success-detail-row"><span>Lokasi Jemput</span><strong>{lokasi}</strong></div>
              <div className="success-detail-row"><span>Metode Bayar</span><strong>{method?.label}</strong></div>
              <div className="success-detail-row"><span>Total Bayar</span><strong>Rp {total.toLocaleString("id-ID")}</strong></div>
            </div>
            <button className="btn-back" onClick={resetAll}>Buat Pesanan Baru</button>
            <button className="btn-back-daftar" onClick={() => navigate("/daftar-mobil")}>Kembali ke Daftar Mobil</button>
          </div>
        </div>
      </>
    );
  }

  // ── PAYMENT ──────────────────────────────────────────────
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
          .pay-detail-box { background: #f8f9ff; border-radius: 14px; padding: 1.25rem; border: 1px solid rgba(26,63,168,0.08); margin-top: 1rem; }
          .pay-detail-label { font-size: 12px; color: #888; margin-bottom: 4px; }
          .pay-detail-number { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
          .pay-detail-number span { font-size: 20px; font-weight: 800; color: #1a1a2e; letter-spacing: 0.05em; }
          .btn-copy { background: linear-gradient(135deg, #1a3fa8, #8b3cc4); color: #fff; border: none; border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
          .pay-detail-name { font-size: 13px; color: #555; margin-top: 6px; }
          .qris-box { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 1.5rem; }
          .qris-placeholder { width: 160px; height: 160px; background: linear-gradient(135deg, #e8eeff, #f0e8ff); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 64px; border: 2px dashed rgba(26,63,168,0.2); }
          .qris-note { font-size: 12px; color: #888; text-align: center; line-height: 1.5; }
          .pay-right { background: #fff; border-radius: 20px; padding: 1.75rem; border: 1px solid rgba(26,63,168,0.08); position: sticky; top: 84px; }
          .summary-title { font-size: 15px; font-weight: 700; color: #1a1a2e; margin: 0 0 1.25rem; }
          .summary-mobil-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.25rem; }
          .summary-mobil-item { display: flex; align-items: center; gap: 10px; padding: 10px; background: #f8f9ff; border-radius: 10px; }
          .summary-mobil-img { width: 56px; height: 40px; object-fit: contain; background: linear-gradient(135deg, #e8eeff, #f0e8ff); border-radius: 8px; flex-shrink: 0; }
          .summary-mobil-info strong { display: block; font-size: 13px; font-weight: 700; color: #1a1a2e; }
          .summary-mobil-info span { font-size: 11px; color: #888; }
          .summary-rows { display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.25rem; }
          .summary-row { display: flex; justify-content: space-between; font-size: 13px; }
          .summary-row span { color: #888; }
          .summary-row strong { color: #1a1a2e; font-weight: 600; }
          .summary-divider { height: 1px; background: #e0e4f0; margin: 4px 0; }
          .summary-total { display: flex; justify-content: space-between; align-items: center; padding: 14px; background: rgba(26,63,168,0.05); border-radius: 12px; margin-bottom: 1.25rem; }
          .summary-total span { font-size: 13px; color: #555; font-weight: 500; }
          .summary-total strong { font-size: 18px; font-weight: 800; color: #1a3fa8; }
          .btn-confirm-pay { background: linear-gradient(135deg, #1a3fa8 0%, #8b3cc4 100%); color: #fff; border: none; border-radius: 12px; padding: 14px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; width: 100%; transition: opacity 0.2s; box-shadow: 0 4px 16px rgba(26,63,168,0.28); }
          .btn-confirm-pay:hover { opacity: 0.9; }
          .btn-confirm-pay:disabled { opacity: 0.45; cursor: not-allowed; }
          .btn-back-form { background: none; border: 1.5px solid #e0e4f0; border-radius: 12px; padding: 11px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; width: 100%; color: #555; margin-top: 8px; transition: border-color 0.2s; }
          .btn-back-form:hover { border-color: #1a3fa8; color: #1a3fa8; }
          .pay-note { font-size: 11px; color: #aaa; text-align: center; margin-top: 10px; line-height: 1.5; }
          @media (max-width: 1024px) { .pay-body { grid-template-columns: 1fr; padding: 2rem; } .pesan-header { padding: 2rem; } .pay-right { position: static; } }
        `}</style>
        <div className="pesan-page">
          <div className="pesan-header">
            <h1>Pembayaran</h1>
            <p>Pilih metode pembayaran dan selesaikan transaksi kamu</p>
          </div>
          <div className="pay-body">
            <div className="pay-left">
              <div className="pay-section">
                <p className="pay-section-title">Transfer Bank</p>
                <div className="pay-method-group">
                  {banks.map((m) => (
                    <div key={m.id} className={`pay-method${selectedPayment === m.id ? " selected" : ""}`} onClick={() => setSelectedPayment(m.id)}>
                      <div className="pay-method-icon">🏦</div>
                      <span className="pay-method-label">Bank {m.label}</span>
                      <div className="pay-method-radio"><div className="pay-method-radio-dot" /></div>
                    </div>
                  ))}
                </div>
                {method?.type === "bank" && (
                  <div className="pay-detail-box">
                    <p className="pay-detail-label">Nomor Rekening Bank {method.label}</p>
                    <div className="pay-detail-number">
                      <span>{method.detail}</span>
                      <button className="btn-copy" onClick={() => handleCopy(method.detail)}>{copied ? "Tersalin!" : "Salin"}</button>
                    </div>
                    <p className="pay-detail-name">a.n. {method.name}</p>
                  </div>
                )}
              </div>
              <div className="pay-section">
                <p className="pay-section-title">QRIS</p>
                <div className={`pay-method${selectedPayment === "qris" ? " selected" : ""}`} onClick={() => setSelectedPayment("qris")}>
                  <div className="pay-method-icon">▦</div>
                  <span className="pay-method-label">QRIS (Semua Aplikasi)</span>
                  <div className="pay-method-radio"><div className="pay-method-radio-dot" /></div>
                </div>
                {selectedPayment === "qris" && (
                  <div className="qris-box">
                    <div className="qris-placeholder">▦</div>
                    <p className="qris-note">QR Code akan tersedia setelah integrasi Midtrans.</p>
                  </div>
                )}
              </div>
              <div className="pay-section">
                <p className="pay-section-title">E-Wallet</p>
                <div className="pay-method-group">
                  {ewallets.map((m) => (
                    <div key={m.id} className={`pay-method${selectedPayment === m.id ? " selected" : ""}`} onClick={() => setSelectedPayment(m.id)}>
                      <div className="pay-method-icon">{m.icon}</div>
                      <span className="pay-method-label">{m.label}</span>
                      <div className="pay-method-radio"><div className="pay-method-radio-dot" /></div>
                    </div>
                  ))}
                </div>
                {method?.type === "ewallet" && (
                  <div className="pay-detail-box">
                    <p className="pay-detail-label">Nomor {method.label}</p>
                    <div className="pay-detail-number">
                      <span>{method.detail}</span>
                      <button className="btn-copy" onClick={() => handleCopy(method.detail)}>{copied ? "Tersalin!" : "Salin"}</button>
                    </div>
                    <p className="pay-detail-name">a.n. {method.name}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="pay-right">
              <p className="summary-title">Ringkasan Pesanan</p>
              <div className="summary-mobil-list">
                {pesananList.map((p) => (
                  <div className="summary-mobil-item" key={p.mobil.id}>
                    {p.mobil.image ? (
                      <img src={p.mobil.image} alt={p.mobil.name} className="summary-mobil-img" />
                    ) : (
                      <div className="summary-mobil-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🚗</div>
                    )}
                    <div className="summary-mobil-info">
                      <strong>{p.mobil.name}</strong>
                      <span>{p.qty} unit × Rp {p.mobil.price.toLocaleString("id-ID")}/hari</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="summary-rows">
                <div className="summary-row"><span>Nama</span><strong>{nama}</strong></div>
                <div className="summary-row"><span>No. WhatsApp</span><strong>{noWa}</strong></div>
                <div className="summary-row"><span>Tanggal</span><strong>{tanggal}</strong></div>
                <div className="summary-row"><span>Durasi</span><strong>{durasi} hari</strong></div>
                <div className="summary-row"><span>Lokasi Jemput</span><strong>{lokasi}</strong></div>
                <div className="summary-row"><span>Biaya Driver</span><strong>Rp {driverFee.toLocaleString("id-ID")}</strong></div>
                <div className="summary-divider" />
              </div>
              <div className="summary-total">
                <span>Total Bayar</span>
                <strong>Rp {total.toLocaleString("id-ID")}</strong>
              </div>
              <button className="btn-confirm-pay" disabled={!selectedPayment} onClick={() => setStep("success")}>Saya Sudah Bayar</button>
              <button className="btn-back-form" onClick={() => setStep("form")}>← Kembali ke Form</button>
              <p className="pay-note">Pembayaran akan diverifikasi otomatis setelah integrasi Midtrans aktif</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── FORM ──────────────────────────────────────────────
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
        .mobil-list { display: flex; flex-direction: column; gap: 10px; }
        .mobil-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 1.5px solid #e0e4f0; border-radius: 14px; background: #fafbff; }
        .mobil-item-img { width: 72px; height: 50px; object-fit: contain; background: linear-gradient(135deg, #e8eeff, #f0e8ff); border-radius: 8px; flex-shrink: 0; }
        .mobil-item-img-placeholder { width: 72px; height: 50px; background: linear-gradient(135deg, #e8eeff, #f0e8ff); border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .mobil-item-info { flex: 1; }
        .mobil-item-info strong { display: block; font-size: 14px; font-weight: 700; color: #1a1a2e; }
        .mobil-item-info span { font-size: 12px; color: #888; }
        .mobil-item-qty { display: flex; align-items: center; gap: 8px; }
        .qty-btn { width: 28px; height: 28px; border-radius: 8px; border: 1.5px solid #e0e4f0; background: #f8f9ff; font-size: 16px; font-weight: 700; color: #1a3fa8; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
        .qty-btn:hover { background: rgba(26,63,168,0.08); border-color: #1a3fa8; }
        .qty-value { font-size: 15px; font-weight: 700; color: #1a1a2e; min-width: 20px; text-align: center; }
        .btn-remove-mobil { background: rgba(239,68,68,0.08); color: #dc2626; border: none; border-radius: 8px; padding: 6px 10px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.15s; }
        .btn-remove-mobil:hover { background: rgba(239,68,68,0.15); }
        .btn-add-mobil { display: flex; align-items: center; gap: 6px; background: rgba(26,63,168,0.06); color: #1a3fa8; border: 1.5px dashed rgba(26,63,168,0.25); border-radius: 12px; padding: 10px 16px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.15s; width: 100%; justify-content: center; }
        .btn-add-mobil:hover { background: rgba(26,63,168,0.1); }
        .add-mobil-overlay { position: fixed; inset: 0; background: rgba(10,15,40,0.5); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .add-mobil-card { background: #fff; border-radius: 20px; width: 100%; max-width: 420px; padding: 1.75rem; box-shadow: 0 24px 64px rgba(0,0,0,0.2); max-height: 80vh; display: flex; flex-direction: column; }
        .add-mobil-title { font-size: 15px; font-weight: 700; color: #1a1a2e; margin: 0 0 1.25rem; flex-shrink: 0; }
        .add-mobil-list { display: flex; flex-direction: column; gap: 8px; overflow-y: auto; flex: 1; }
        .add-mobil-item { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1.5px solid #e0e4f0; border-radius: 12px; cursor: pointer; background: #fafbff; transition: border-color 0.2s, background 0.2s; }
        .add-mobil-item:hover { border-color: #1a3fa8; background: rgba(26,63,168,0.04); }
        .add-mobil-img { width: 64px; height: 44px; object-fit: contain; background: linear-gradient(135deg, #e8eeff, #f0e8ff); border-radius: 8px; flex-shrink: 0; }
        .add-mobil-img-placeholder { width: 64px; height: 44px; background: linear-gradient(135deg, #e8eeff, #f0e8ff); border-radius: 8px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
        .add-mobil-info strong { display: block; font-size: 13px; font-weight: 700; color: #1a1a2e; }
        .add-mobil-info span { font-size: 12px; color: #888; }
        .add-mobil-price { font-size: 13px; font-weight: 700; color: #1a3fa8; white-space: nowrap; margin-left: auto; }
        .btn-close-add { margin-top: 12px; width: 100%; background: #f0f2f8; border: none; border-radius: 10px; padding: 10px; font-size: 14px; font-weight: 600; cursor: pointer; color: #555; font-family: 'Plus Jakarta Sans', sans-serif; flex-shrink: 0; }
        .add-mobil-loading { display: flex; align-items: center; justify-content: center; padding: 2rem; gap: 10px; color: #888; font-size: 14px; }
        .add-mobil-empty { text-align: center; padding: 2rem; color: #aaa; font-size: 13px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 18px; height: 18px; border: 2px solid #e0e4f0; border-top-color: #1a3fa8; border-radius: 50%; animation: spin 0.7s linear infinite; }
        .driver-info-box { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: rgba(26,63,168,0.05); border: 1.5px solid rgba(26,63,168,0.15); border-radius: 12px; }
        .driver-info-icon { font-size: 24px; flex-shrink: 0; }
        .driver-info-text strong { display: block; font-size: 14px; font-weight: 700; color: #1a1a2e; }
        .driver-info-text span { font-size: 12px; color: #666; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field.full { grid-column: 1 / -1; }
        .form-field label { font-size: 13px; font-weight: 600; color: #444; }
        .form-input { padding: 11px 14px; border: 1.5px solid #e0e4f0; border-radius: 10px; font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif; color: #1a1a2e; background: #f8f9ff; transition: border-color 0.2s, box-shadow 0.2s; outline: none; width: 100%; }
        .form-input:focus { border-color: #1a3fa8; background: #fff; box-shadow: 0 0 0 3px rgba(26,63,168,0.08); }
        .form-input::placeholder { color: #bbb; }
        .durasi-wrap { display: flex; align-items: center; gap: 12px; }
        .durasi-btn { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid #e0e4f0; background: #f8f9ff; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #1a3fa8; font-weight: 700; transition: background 0.15s; flex-shrink: 0; }
        .durasi-btn:hover { background: rgba(26,63,168,0.08); border-color: #1a3fa8; }
        .durasi-value { font-size: 16px; font-weight: 700; color: #1a1a2e; min-width: 60px; text-align: center; }
        .pesan-summary { background: #fff; border-radius: 20px; padding: 1.75rem; border: 1px solid rgba(26,63,168,0.08); position: sticky; top: 84px; }
        .summary-title { font-size: 15px; font-weight: 700; color: #1a1a2e; margin: 0 0 1.25rem; }
        .summary-mobil-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 1.25rem; }
        .summary-mobil-item { display: flex; align-items: center; gap: 10px; padding: 10px; background: #f8f9ff; border-radius: 10px; }
        .summary-mobil-img { width: 56px; height: 40px; object-fit: contain; background: linear-gradient(135deg, #e8eeff, #f0e8ff); border-radius: 8px; flex-shrink: 0; }
        .summary-mobil-info strong { display: block; font-size: 13px; font-weight: 700; color: #1a1a2e; }
        .summary-mobil-info span { font-size: 11px; color: #888; }
        .summary-empty { text-align: center; padding: 1.5rem; color: #aaa; font-size: 13px; background: #f8f9ff; border-radius: 10px; margin-bottom: 1.25rem; }
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
          <p>Isi data pemesanan kamu</p>
        </div>

        <div className="pesan-body">
          <div className="pesan-form-wrap">

            {/* 1. Kendaraan */}
            <div className="form-section">
              <div className="form-section-title"><span>1</span>Kendaraan yang Dipesan</div>
              <div className="mobil-list">
                {pesananList.length === 0 && (
                  <p style={{ fontSize: "13px", color: "#aaa", textAlign: "center", padding: "1rem" }}>
                    Belum ada kendaraan dipilih
                  </p>
                )}
                {pesananList.map((p) => (
                  <div className="mobil-item" key={p.mobil.id}>
                    {p.mobil.image ? (
                      <img src={p.mobil.image} alt={p.mobil.name} className="mobil-item-img" />
                    ) : (
                      <div className="mobil-item-img-placeholder">🚗</div>
                    )}
                    <div className="mobil-item-info">
                      <strong>{p.mobil.name}</strong>
                      <span>{p.mobil.type} · Rp {p.mobil.price.toLocaleString("id-ID")}/hari</span>
                    </div>
                    <div className="mobil-item-qty">
                      <button className="qty-btn" onClick={() => updateQty(p.mobil.id, -1)}>−</button>
                      <span className="qty-value">{p.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(p.mobil.id, 1)}>+</button>
                    </div>
                    <button className="btn-remove-mobil" onClick={() => removeMobil(p.mobil.id)}>✕</button>
                  </div>
                ))}
                <button className="btn-add-mobil" onClick={openAddMobil}>
                  ＋ Tambah Kendaraan Lain
                </button>
              </div>
            </div>

            {/* 2. Data Pemesan */}
            <div className="form-section">
              <div className="form-section-title"><span>2</span>Data Pemesan</div>
              <div className="form-grid">
                <div className="form-field full">
                  <label>Nama Lengkap</label>
                  <input className="form-input" type="text" placeholder="Masukkan nama lengkap" value={nama} onChange={(e) => setNama(e.target.value)} />
                </div>
                <div className="form-field full">
                  <label>Nomor WhatsApp</label>
                  <input
                    className="form-input"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={noWa}
                    onChange={(e) => setNoWa(e.target.value.replace(/[^0-9]/g, ""))}
                    inputMode="numeric"
                  />
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
                <div className="form-field full">
                  <label>Lokasi Penjemputan</label>
                  <input className="form-input" type="text" placeholder="Masukkan alamat penjemputan" value={lokasi} onChange={(e) => setLokasi(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="driver-info-box">
                <div className="driver-info-text">
                  <strong>Semua Sewa Sudah Termasuk Driver</strong>
                  <span>Biaya driver Rp {DRIVER_FEE_PER_HARI.toLocaleString("id-ID")}/hari sudah termasuk dalam total</span>
                </div>
              </div>
            </div>

          </div>

          {/* Summary */}
          <div className="pesan-summary">
            <p className="summary-title">Ringkasan Pesanan</p>
            {pesananList.length === 0 ? (
              <div className="summary-empty">Belum ada kendaraan dipilih</div>
            ) : (
              <div className="summary-mobil-list">
                {pesananList.map((p) => (
                  <div className="summary-mobil-item" key={p.mobil.id}>
                    {p.mobil.image ? (
                      <img src={p.mobil.image} alt={p.mobil.name} className="summary-mobil-img" />
                    ) : (
                      <div className="summary-mobil-img" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>🚗</div>
                    )}
                    <div className="summary-mobil-info">
                      <strong>{p.mobil.name}</strong>
                      <span>{p.qty} unit × Rp {p.mobil.price.toLocaleString("id-ID")}/hari</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="summary-rows">
              <div className="summary-row"><span>Nama</span><strong>{nama || "-"}</strong></div>
              <div className="summary-row"><span>Tanggal</span><strong>{tanggal || "-"}</strong></div>
              <div className="summary-row"><span>Durasi</span><strong>{durasi} hari</strong></div>
              <div className="summary-row"><span>Lokasi Jemput</span><strong>{lokasi || "-"}</strong></div>
              <div className="summary-row"><span>Biaya Driver</span><strong>Rp {driverFee.toLocaleString("id-ID")}</strong></div>
              <div className="summary-divider" />
            </div>
            <div className="summary-total">
              <span>Total Estimasi</span>
              <strong>Rp {total.toLocaleString("id-ID")}</strong>
            </div>
            <button
              className="btn-pesan-submit"
              disabled={pesananList.length === 0 || !nama || !tanggal || !noWa || !lokasi}
              onClick={() => setStep("payment")}
            >
              Lanjut ke Pembayaran →
            </button>
            <p className="summary-note">Tim kami akan menghubungi kamu untuk konfirmasi lebih lanjut</p>
          </div>
        </div>
      </div>

      {/* Modal Tambah Kendaraan */}
      {showAddMobil && (
        <div className="add-mobil-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddMobil(false)}>
          <div className="add-mobil-card">
            <p className="add-mobil-title">Pilih Kendaraan</p>
            <div className="add-mobil-list">
              {loadingCars ? (
                <div className="add-mobil-loading">
                  <div className="spinner" /> Memuat kendaraan...
                </div>
              ) : availableCars.length === 0 ? (
                <div className="add-mobil-empty">Tidak ada kendaraan tersedia</div>
              ) : (
                availableCars
                  .filter((car) => !pesananList.find((p) => p.mobil.id === car.id))
                  .map((car) => (
                    <div className="add-mobil-item" key={car.id} onClick={() => addMobil(car)}>
                      {car.image ? (
                        <img src={car.image} alt={car.name} className="add-mobil-img" />
                      ) : (
                        <div className="add-mobil-img-placeholder">🚗</div>
                      )}
                      <div className="add-mobil-info">
                        <strong>{car.name}</strong>
                        <span>{car.type} · {car.seats} Kursi</span>
                      </div>
                      <span className="add-mobil-price">
                        Rp {car.price.toLocaleString("id-ID")}<small style={{ fontWeight: 400, color: "#888" }}>/hari</small>
                      </span>
                    </div>
                  ))
              )}
            </div>
            <button className="btn-close-add" onClick={() => setShowAddMobil(false)}>Batal</button>
          </div>
        </div>
      )}
    </>
  );
}
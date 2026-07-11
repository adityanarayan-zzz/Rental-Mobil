import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateWaLink, generateWaMessage } from "../utils/waTemplate";
import { API_URL } from "../utils/api";

interface Mobil {
  id_mobil: number;
  nama: string;
  harga: number;
  totalUnit: number;
  unitTersedia: number;
  gambar?: string;
  tersedia: boolean;
}

interface Transaksi {
  id_transaksi: number;
  order_id: string;
  nama_pemesan: string;
  no_wa: string;
  tanggal_sewa: string;
  durasi: number;
  lokasi: string;
  total_harga: number;
  status: string;
  qty: number;
  createdAt: string;
  mobil: { nama: string; gambar?: string };
}

const emptyForm = { nama: "", harga: 0, totalUnit: 1, gambar: "" };
type ModalType = "add" | "edit" | "delete" | null;
type ActiveTab = "mobil" | "pesanan";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>("mobil");

  // Mobil state
  const [mobils, setMobils] = useState<Mobil[]>([]);
  const [loadingMobil, setLoadingMobil] = useState(true);
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<Mobil | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImg, setUploadingImg] = useState(false);

  // Transaksi state
  const [transaksis, setTransaksis] = useState<Transaksi[]>([]);
  const [loadingTransaksi, setLoadingTransaksi] = useState(false);
  const [searchPesan, setSearchPesan] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  const [adminUser, setAdminUser] = useState<{ username: string } | null>(null);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (!stored) { navigate("/admin"); return; }
    setAdminUser(JSON.parse(stored));
    fetchMobil();
    fetchTransaksi();
  }, []);

  async function fetchMobil() {
    try {
      const res = await fetch(`${API_URL}/api/mobil`);
      const data = await res.json();
      setMobils(data.mobils);
    } catch { console.error("Gagal fetch mobil"); }
    finally { setLoadingMobil(false); }
  }

  async function fetchTransaksi() {
    setLoadingTransaksi(true);
    try {
      const res = await fetch(`${API_URL}/api/transaksi`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTransaksis(data.transaksis);
    } catch { console.error("Gagal fetch transaksi"); }
    finally { setLoadingTransaksi(false); }
  }

  async function handleFileUpload(file: File) {
    setUploadingImg(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${API_URL}/api/mobil/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) setForm((prev) => ({ ...prev, gambar: data.url }));
      else setError("Gagal upload gambar");
    } catch { setError("Gagal upload gambar"); }
    finally { setUploadingImg(false); }
  }

  async function handleUpdateStatus(id: number, status: string) {
    setUpdatingStatus(id);
    try {
      const res = await fetch(`${API_URL}/api/transaksi/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchTransaksi();
        await fetchMobil();
      }
    } catch { console.error("Gagal update status"); }
    finally { setUpdatingStatus(null); }
  }

  async function handleDeleteTransaksi(id: number) {
    if (!confirm("Hapus transaksi ini?")) return;
    try {
      await fetch(`${API_URL}/api/transaksi/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchTransaksi();
      await fetchMobil();
    } catch { console.error("Gagal hapus transaksi"); }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/");
  }

  function openAdd() { setForm(emptyForm); setError(""); setModal("add"); }
  function openEdit(m: Mobil) {
    setSelected(m);
    setForm({ nama: m.nama, harga: m.harga, totalUnit: m.totalUnit, gambar: m.gambar || "" });
    setError(""); setModal("edit");
  }
  function openDelete(m: Mobil) { setSelected(m); setModal("delete"); }

  async function handleAdd() {
    if (!form.nama || !form.harga || !form.totalUnit) { setError("Semua field wajib diisi"); return; }
    setSubmitLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/mobil`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      await fetchMobil(); setModal(null);
    } catch { setError("Gagal terhubung ke server"); }
    finally { setSubmitLoading(false); }
  }

  async function handleEdit() {
    if (!form.nama || !form.harga || !form.totalUnit) { setError("Semua field wajib diisi"); return; }
    setSubmitLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/mobil/${selected?.id_mobil}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      await fetchMobil(); setModal(null);
    } catch { setError("Gagal terhubung ke server"); }
    finally { setSubmitLoading(false); }
  }

  async function handleDelete() {
    setSubmitLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/mobil/${selected?.id_mobil}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { setError("Gagal menghapus"); return; }
      await fetchMobil(); setModal(null);
    } catch { setError("Gagal terhubung ke server"); }
    finally { setSubmitLoading(false); }
  }

  async function handleUnitChange(id: number, delta: number) {
    try {
      const res = await fetch(`${API_URL}/api/mobil/${id}/unit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ delta }),
      });
      if (res.ok) await fetchMobil();
    } catch { console.error("Gagal update unit"); }
  }

  const filteredMobil = mobils.filter((m) => m.nama.toLowerCase().includes(search.toLowerCase()));

  const filteredTransaksi = transaksis.filter((t) => {
    const matchSearch = (t.nama_pemesan?.toLowerCase() ?? "").includes(searchPesan.toLowerCase()) ||
      (t.mobil?.nama?.toLowerCase() ?? "").includes(searchPesan.toLowerCase());
    const matchStatus = filterStatus === "Semua" || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalUnit = mobils.reduce((a, b) => a + b.totalUnit, 0);
  const unitTersedia = mobils.reduce((a, b) => a + b.unitTersedia, 0);

  const statusColor: Record<string, string> = {
    pending: "#ca8a04",
    konfirmasi: "#1a3fa8",
    selesai: "#16a34a",
  };
  const statusBg: Record<string, string> = {
    pending: "rgba(234,179,8,0.1)",
    konfirmasi: "rgba(26,63,168,0.1)",
    selesai: "rgba(34,197,94,0.1)",
  };
  const statusLabel: Record<string, string> = {
    pending: "Pending",
    konfirmasi: "Konfirmasi",
    selesai: "Selesai",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .admin-page { font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; background: #f0f2fa; display: flex; padding-top: 64px; }
        .admin-sidebar { width: 240px; background: linear-gradient(180deg, #c0392b 0%, #8b3cc4 25%, #3b5fd4 65%, #1a3fa8 100%); min-height: calc(100vh - 64px); display: flex; flex-direction: column; position: fixed; top: 64px; left: 0; z-index: 100; }
        .admin-sidebar-logo { display: flex; align-items: center; gap: 10px; padding: 1.5rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .admin-sidebar-logo img { width: 36px; height: 36px; object-fit: contain; border-radius: 8px; }
        .admin-sidebar-logo-text strong { display: block; font-size: 14px; font-weight: 700; color: #fff; }
        .admin-sidebar-logo-text span { font-size: 10px; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.05em; }
        .admin-sidebar-nav { flex: 1; padding: 1rem 0; }
        .admin-nav-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.08em; padding: 8px 1.25rem 4px; }
        .admin-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 1.25rem; color: rgba(255,255,255,0.65); font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.15s, color 0.15s; border: none; background: none; width: 100%; text-align: left; font-family: 'Plus Jakarta Sans', sans-serif; }
        .admin-nav-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .admin-nav-item.active { background: rgba(255,255,255,0.12); color: #fff; font-weight: 600; }
        .admin-nav-item-icon { width: 20px; text-align: center; font-size: 16px; }
        .admin-sidebar-footer { padding: 1rem 1.25rem; border-top: 1px solid rgba(255,255,255,0.1); }
        .admin-user-info { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .admin-user-avatar { width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; text-transform: uppercase; flex-shrink: 0; }
        .admin-user-name { font-size: 13px; font-weight: 600; color: #fff; }
        .admin-user-role { font-size: 11px; color: rgba(255,255,255,0.5); }
        .admin-btn-logout { width: 100%; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.15s; }
        .admin-btn-logout:hover { background: rgba(255,255,255,0.15); color: #fff; }
        .admin-main { margin-left: 240px; flex: 1; padding: 2rem; min-height: calc(100vh - 64px); }
        .admin-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem; }
        .admin-topbar h1 { font-size: 1.5rem; font-weight: 800; color: #1a1a2e; letter-spacing: -0.02em; }
        .admin-topbar p { font-size: 13px; color: #888; margin-top: 2px; }
        .admin-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.75rem; }
        .admin-stat-card { background: #fff; border-radius: 16px; padding: 1.25rem; border: 1px solid rgba(26,63,168,0.08); }
        .admin-stat-label { font-size: 12px; color: #888; font-weight: 500; margin-bottom: 6px; }
        .admin-stat-value { font-size: 1.8rem; font-weight: 800; color: #1a1a2e; letter-spacing: -0.02em; }
        .admin-stat-sub { font-size: 11px; color: #aaa; margin-top: 2px; }
        .admin-stat-icon { font-size: 24px; margin-bottom: 8px; }
        .admin-table-section { background: #fff; border-radius: 20px; border: 1px solid rgba(26,63,168,0.08); overflow: hidden; }
        .admin-table-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #f0f2fa; flex-wrap: wrap; gap: 10px; }
        .admin-table-header h2 { font-size: 15px; font-weight: 700; color: #1a1a2e; }
        .admin-table-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .admin-search { padding: 8px 14px; border: 1.5px solid #e0e4f0; border-radius: 10px; font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif; color: #1a1a2e; background: #f8f9ff; outline: none; width: 200px; transition: border-color 0.2s; }
        .admin-search:focus { border-color: #1a3fa8; background: #fff; }
        .admin-filter-select { padding: 8px 14px; border: 1.5px solid #e0e4f0; border-radius: 10px; font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif; color: #555; background: #f8f9ff; outline: none; cursor: pointer; }
        .admin-btn-add { background: linear-gradient(135deg, #1a3fa8 0%, #8b3cc4 60%, #c0392b 100%); color: #fff; border: none; border-radius: 10px; padding: 9px 18px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; align-items: center; gap: 6px; transition: opacity 0.2s, transform 0.15s; box-shadow: 0 4px 12px rgba(26,63,168,0.25); }
        .admin-btn-add:hover { opacity: 0.9; transform: translateY(-1px); }
        .admin-table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        thead tr { background: #f8f9ff; border-bottom: 1px solid #e8eaf4; }
        th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; }
        td { padding: 14px 16px; border-bottom: 1px solid #f0f2fa; color: #1a1a2e; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fafbff; }
        .unit-control { display: flex; align-items: center; gap: 8px; }
        .unit-btn { width: 26px; height: 26px; border-radius: 6px; border: 1.5px solid #e0e4f0; background: #f8f9ff; font-size: 14px; font-weight: 700; color: #1a3fa8; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
        .unit-btn:hover { background: rgba(26,63,168,0.08); border-color: #1a3fa8; }
        .unit-value { font-weight: 700; min-width: 20px; text-align: center; }
        .tersedia-badge { font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
        .tersedia-badge.ok { background: rgba(34,197,94,0.1); color: #16a34a; }
        .tersedia-badge.low { background: rgba(234,179,8,0.1); color: #ca8a04; }
        .tersedia-badge.empty { background: rgba(239,68,68,0.1); color: #dc2626; }
        .action-btns { display: flex; gap: 6px; flex-wrap: wrap; }
        .btn-edit { background: rgba(26,63,168,0.08); color: #1a3fa8; border: none; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.15s; }
        .btn-edit:hover { background: rgba(26,63,168,0.15); }
        .btn-delete { background: rgba(239,68,68,0.08); color: #dc2626; border: none; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.15s; }
        .btn-delete:hover { background: rgba(239,68,68,0.15); }
        .btn-status { border: none; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: opacity 0.15s; }
        .btn-status:disabled { opacity: 0.5; cursor: not-allowed; }
        .status-badge { display: inline-block; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(10,15,40,0.5); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.15s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-card { background: #fff; border-radius: 20px; width: 100%; max-width: 440px; padding: 2rem; box-shadow: 0 24px 64px rgba(0,0,0,0.2); animation: slideUp 0.2s ease; max-height: 90vh; overflow-y: auto; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .modal-title { font-size: 1.1rem; font-weight: 800; color: #1a1a2e; margin: 0 0 1.25rem; }
        .modal-form { display: flex; flex-direction: column; gap: 14px; }
        .modal-field { display: flex; flex-direction: column; gap: 5px; }
        .modal-field label { font-size: 12px; font-weight: 600; color: #555; }
        .modal-input { padding: 10px 12px; border: 1.5px solid #e0e4f0; border-radius: 8px; font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif; color: #1a1a2e; background: #f8f9ff; outline: none; transition: border-color 0.2s; width: 100%; }
        .modal-input:focus { border-color: #1a3fa8; background: #fff; }
        .modal-error { background: #fff0f0; border: 1px solid #ffcccc; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #c0392b; }
        .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px; }
        .btn-cancel { background: #f0f2f8; color: #555; border: none; border-radius: 10px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
        .btn-cancel:hover { background: #e0e4f0; }
        .btn-confirm { background: linear-gradient(135deg, #1a3fa8 0%, #8b3cc4 60%, #c0392b 100%); color: #fff; border: none; border-radius: 10px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; box-shadow: 0 4px 12px rgba(26,63,168,0.25); }
        .btn-confirm:hover { opacity: 0.9; }
        .btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-confirm-delete { background: linear-gradient(135deg, #dc2626, #b91c1c); color: #fff; border: none; border-radius: 10px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; }
        .delete-warning { background: #fff5f5; border: 1px solid #fecaca; border-radius: 10px; padding: 12px 14px; font-size: 13px; color: #dc2626; margin-bottom: 1rem; }
        .empty-state { text-align: center; padding: 4rem; color: #aaa; }
        .empty-state p { font-size: 14px; margin-top: 8px; }
        .loading-wrap { display: flex; align-items: center; justify-content: center; padding: 4rem; color: #888; font-size: 14px; gap: 10px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 20px; height: 20px; border: 2px solid #e0e4f0; border-top-color: #1a3fa8; border-radius: 50%; animation: spin 0.7s linear infinite; }
        .img-preview { width: 100%; height: 130px; object-fit: contain; border-radius: 10px; background: linear-gradient(135deg,#e8eeff,#f0e8ff); margin-bottom: 8px; }
        .img-upload-btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 14px; border: 1.5px dashed rgba(26,63,168,0.3); border-radius: 8px; background: #f8f9ff; cursor: pointer; font-size: 13px; color: #1a3fa8; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 8px; width: 100%; }
        .img-upload-btn:hover { background: rgba(26,63,168,0.06); }
        @media (max-width: 1024px) { .admin-stats { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <div className="admin-page">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-logo">
            <img src="/src/assets/LOGO_PPS.jpeg" alt="PPS" />
            <div className="admin-sidebar-logo-text">
              <strong>Admin Dashboard</strong>
            </div>
          </div>
          <nav className="admin-sidebar-nav">
            <div className="admin-nav-label">Menu</div>
            <button className={`admin-nav-item${activeTab === "mobil" ? " active" : ""}`} onClick={() => setActiveTab("mobil")}>
              <span className="admin-nav-item-icon">🚗</span>Manajemen Mobil
            </button>
            <button className={`admin-nav-item${activeTab === "pesanan" ? " active" : ""}`} onClick={() => { setActiveTab("pesanan"); fetchTransaksi(); }}>
              <span className="admin-nav-item-icon">📋</span>Data Pesanan
            </button>
          </nav>
          <div className="admin-sidebar-footer">
            <div className="admin-user-info">
              <div className="admin-user-avatar">{adminUser?.username?.charAt(0) ?? "A"}</div>
              <div>
                <div className="admin-user-name">{adminUser?.username ?? "Admin"}</div>
                <div className="admin-user-role">Administrator</div>
              </div>
            </div>
            <button className="admin-btn-logout" onClick={handleLogout}>Keluar</button>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="admin-stat-icon">🚗</div>
              <div className="admin-stat-label">Total Jenis Mobil</div>
              <div className="admin-stat-value">{mobils.length}</div>
              <div className="admin-stat-sub">jenis kendaraan</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon">🔢</div>
              <div className="admin-stat-label">Total Unit</div>
              <div className="admin-stat-value">{totalUnit}</div>
              <div className="admin-stat-sub">unit keseluruhan</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon">✅</div>
              <div className="admin-stat-label">Unit Tersedia</div>
              <div className="admin-stat-value" style={{ color: "#16a34a" }}>{unitTersedia}</div>
              <div className="admin-stat-sub">siap disewa</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-icon">📋</div>
              <div className="admin-stat-label">Total Pesanan</div>
              <div className="admin-stat-value" style={{ color: "#1a3fa8" }}>{transaksis.length}</div>
              <div className="admin-stat-sub">semua transaksi</div>
            </div>
          </div>

          {activeTab === "mobil" && (
            <div className="admin-table-section">
              <div className="admin-table-header">
                <h2>Daftar Kendaraan</h2>
                <div className="admin-table-controls">
                  <input className="admin-search" type="text" placeholder="Cari nama mobil..." value={search} onChange={(e) => setSearch(e.target.value)} />
                  <button className="admin-btn-add" onClick={openAdd}>＋ Tambah Mobil</button>
                </div>
              </div>
              <div className="admin-table-wrap">
                {loadingMobil ? (
                  <div className="loading-wrap"><div className="spinner" /> Memuat data...</div>
                ) : filteredMobil.length === 0 ? (
                  <div className="empty-state"><div style={{ fontSize: "3rem" }}>🚗</div><p>Tidak ada kendaraan ditemukan</p></div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama Kendaraan</th>
                        <th>Harga/Hari</th>
                        <th>Total Unit</th>
                        <th>Tersedia</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMobil.map((m, i) => (
                        <tr key={m.id_mobil}>
                          <td style={{ color: "#aaa", fontWeight: 500 }}>{i + 1}</td>
                          <td style={{ fontWeight: 600 }}>{m.nama}</td>
                          <td style={{ fontWeight: 700, color: "#1a3fa8" }}>Rp {m.harga.toLocaleString("id-ID")}</td>
                          <td>
                            <div className="unit-control">
                              <button className="unit-btn" onClick={() => handleUnitChange(m.id_mobil, -1)}>−</button>
                              <span className="unit-value">{m.totalUnit}</span>
                              <button className="unit-btn" onClick={() => handleUnitChange(m.id_mobil, 1)}>+</button>
                            </div>
                          </td>
                          <td>
                            <span className={`tersedia-badge ${m.unitTersedia === 0 ? "empty" : m.unitTersedia <= 1 ? "low" : "ok"}`}>
                              {m.unitTersedia === 0 ? "Habis" : `${m.unitTersedia} unit`}
                            </span>
                          </td>
                          <td>
                            <div className="action-btns">
                              <button className="btn-edit" onClick={() => openEdit(m)}>✏️ Edit</button>
                              <button className="btn-delete" onClick={() => openDelete(m)}>🗑️ Hapus</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}


          {activeTab === "pesanan" && (
            <div className="admin-table-section">
              <div className="admin-table-header">
                <h2>Data Pesanan</h2>
                <div className="admin-table-controls">
                  <input className="admin-search" type="text" placeholder="Cari nama / mobil..." value={searchPesan} onChange={(e) => setSearchPesan(e.target.value)} />
                  <select className="admin-filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="Semua">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="konfirmasi">Konfirmasi</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>
              </div>
              <div className="admin-table-wrap">
                {loadingTransaksi ? (
                  <div className="loading-wrap"><div className="spinner" /> Memuat pesanan...</div>
                ) : filteredTransaksi.length === 0 ? (
                  <div className="empty-state"><div style={{ fontSize: "3rem" }}>📋</div><p>Tidak ada pesanan ditemukan</p></div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Pemesan</th>
                        <th>Mobil</th>
                        <th>Tanggal</th>
                        <th>Durasi</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransaksi.map((t, i) => (
                        <tr key={t.id_transaksi}>
                          <td style={{ color: "#aaa", fontWeight: 500 }}>{i + 1}</td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{t.nama_pemesan}</div>
                            <div style={{ fontSize: 12, color: "#888" }}>{t.no_wa}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{t.mobil.nama}</div>
                            <div style={{ fontSize: 12, color: "#888" }}>{t.qty} unit</div>
                          </td>
                          <td>
                            <div>{new Date(t.tanggal_sewa).toLocaleDateString("id-ID")}</div>
                            <div style={{ fontSize: 12, color: "#888" }}>{t.lokasi}</div>
                          </td>
                          <td>{t.durasi} hari</td>
                          <td style={{ fontWeight: 700, color: "#1a3fa8" }}>Rp {t.total_harga.toLocaleString("id-ID")}</td>
                          <td>
                            <span className="status-badge" style={{ background: statusBg[t.status], color: statusColor[t.status] }}>
                              {statusLabel[t.status]}
                            </span>
                          </td>
                          <td>
                            <div className="action-btns">
                              {t.status === "pending" && (
                                <button
                                  className="btn-status"
                                  style={{ background: "rgba(26,63,168,0.08)", color: "#1a3fa8" }}
                                  disabled={updatingStatus === t.id_transaksi}
                                  onClick={() => handleUpdateStatus(t.id_transaksi, "konfirmasi")}
                                >
                                  ✓ Konfirmasi
                                </button>
                              )}
                              {t.status === "konfirmasi" && (
                                <button
                                  className="btn-status"
                                  style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }}
                                  disabled={updatingStatus === t.id_transaksi}
                                  onClick={() => handleUpdateStatus(t.id_transaksi, "selesai")}
                                >
                                  ✓ Selesai
                                </button>
                              )}
                              <a
                                href={generateWaLink(
                                  t.no_wa,
                                  generateWaMessage({
                                    nama: t.nama_pemesan,
                                    noWa: t.no_wa,
                                    namaMobil: t.mobil.nama,
                                    qty: t.qty,
                                    tanggalSewa: t.tanggal_sewa,
                                    durasi: t.durasi,
                                    lokasi: t.lokasi,
                                    totalHarga: t.total_harga,
                                    orderId: t.order_id,
                                  })
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-status"
                                style={{ background: "rgba(37,211,102,0.1)", color: "#128C7E", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                              >
                                💬 WA
                              </a>
                              <button className="btn-delete" onClick={() => handleDeleteTransaksi(t.id_transaksi)}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {(modal === "add" || modal === "edit") && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-card">
            <h2 className="modal-title">{modal === "add" ? "Tambah Kendaraan Baru" : "Edit Kendaraan"}</h2>
            <div className="modal-form">
              {error && <div className="modal-error">{error}</div>}
              <div className="modal-field">
                <label>Nama Kendaraan</label>
                <input className="modal-input" type="text" placeholder="Toyota Innova" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </div>
              <div className="modal-field">
                <label>Harga per Hari (Rp)</label>
                <input className="modal-input" type="number" min={0} placeholder="350000" value={form.harga} onChange={(e) => setForm({ ...form, harga: Number(e.target.value) })} />
              </div>
              <div className="modal-field">
                <label>Total Unit</label>
                <input className="modal-input" type="number" min={1} placeholder="5" value={form.totalUnit} onChange={(e) => setForm({ ...form, totalUnit: Number(e.target.value) })} />
              </div>
              <div className="modal-field">
                <label>Gambar Kendaraan</label>
                {form.gambar && <img src={form.gambar} alt="preview" className="img-preview" />}
                <label className="img-upload-btn" style={{ opacity: uploadingImg ? 0.6 : 1, cursor: uploadingImg ? "not-allowed" : "pointer" }}>
                  {uploadingImg ? (
                    <><div className="spinner" style={{ width: 14, height: 14 }} /> Mengupload...</>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 16 12 12 8 16"></polyline>
                        <line x1="12" y1="12" x2="12" y2="21"></line>
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                      </svg>
                      Pilih dari File
                    </>
                  )}
                  <input type="file" accept="image/*" style={{ display: "none" }} disabled={uploadingImg}
                    onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file); e.target.value = ""; }}
                  />
                </label>
                <input className="modal-input" type="text" placeholder="Atau paste URL gambar..." value={form.gambar} onChange={(e) => setForm({ ...form, gambar: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setModal(null)}>Batal</button>
                <button className="btn-confirm" disabled={submitLoading || uploadingImg} onClick={modal === "add" ? handleAdd : handleEdit}>
                  {submitLoading ? "Menyimpan..." : modal === "add" ? "Tambah" : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {modal === "delete" && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-card">
            <h2 className="modal-title">Hapus Kendaraan</h2>
            <div className="delete-warning">⚠️ Kamu akan menghapus <strong>{selected?.nama}</strong>. Tindakan ini tidak bisa dibatalkan.</div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setModal(null)}>Batal</button>
              <button className="btn-confirm-delete" disabled={submitLoading} onClick={handleDelete}>
                {submitLoading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
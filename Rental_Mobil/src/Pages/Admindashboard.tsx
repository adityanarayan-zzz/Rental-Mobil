import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Mobil {
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

const TIPE_OPTIONS = ["MPV", "SUV", "Hatchback", "Van", "Sedan"];
const emptyForm = { nama: "", tipe: "MPV", harga: 0, kursi: 5, totalUnit: 1, gambar: "" };
type ModalType = "add" | "edit" | "delete" | null;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [mobils, setMobils] = useState<Mobil[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<Mobil | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filterTipe, setFilterTipe] = useState("Semua");
  const [adminUser, setAdminUser] = useState<{ username: string } | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (!stored) { navigate("/admin"); return; }
    setAdminUser(JSON.parse(stored));
    fetchMobil();
  }, []);

  async function fetchMobil() {
    try {
      const res = await fetch("http://localhost:3000/api/mobil");
      const data = await res.json();
      setMobils(data.mobils);
    } catch {
      console.error("Gagal fetch mobil");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/");
  }

  function openAdd() {
    setForm(emptyForm);
    setError("");
    setModal("add");
  }

  function openEdit(m: Mobil) {
    setSelected(m);
    setForm({ nama: m.nama, tipe: m.tipe, harga: m.harga, kursi: m.kursi, totalUnit: m.totalUnit, gambar: m.gambar || "" });
    setError("");
    setModal("edit");
  }

  function openDelete(m: Mobil) {
    setSelected(m);
    setModal("delete");
  }

  async function handleAdd() {
    if (!form.nama || !form.harga || !form.kursi || !form.totalUnit) {
      setError("Semua field wajib diisi");
      return;
    }
    setSubmitLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/mobil", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      await fetchMobil();
      setModal(null);
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleEdit() {
    if (!form.nama || !form.harga || !form.kursi || !form.totalUnit) {
      setError("Semua field wajib diisi");
      return;
    }
    setSubmitLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/mobil/${selected?.id_mobil}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      await fetchMobil();
      setModal(null);
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleDelete() {
    setSubmitLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/mobil/${selected?.id_mobil}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { setError("Gagal menghapus"); return; }
      await fetchMobil();
      setModal(null);
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleUnitChange(id: number, delta: number) {
    try {
      const res = await fetch(`http://localhost:3000/api/mobil/${id}/unit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ delta }),
      });
      if (res.ok) await fetchMobil();
    } catch {
      console.error("Gagal update unit");
    }
  }

  const filtered = mobils.filter((m) => {
    const matchSearch = m.nama.toLowerCase().includes(search.toLowerCase());
    const matchTipe = filterTipe === "Semua" || m.tipe === filterTipe;
    return matchSearch && matchTipe;
  });

  const totalUnit = mobils.reduce((a, b) => a + b.totalUnit, 0);
  const unitTersedia = mobils.reduce((a, b) => a + b.unitTersedia, 0);
  const sedangDisewa = totalUnit - unitTersedia;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .admin-page { font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; background: #f0f2fa; display: flex; }
        .admin-sidebar { width: 240px; background: linear-gradient(180deg, #0f1f5c 0%, #1a3fa8 100%); min-height: 100vh; display: flex; flex-direction: column; position: fixed; top: 0; left: 0; z-index: 100; }
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
        .admin-main { margin-left: 240px; flex: 1; padding: 2rem; min-height: 100vh; }
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
        .admin-btn-add { background: linear-gradient(135deg, #1a3fa8, #8b3cc4); color: #fff; border: none; border-radius: 10px; padding: 9px 18px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; display: flex; align-items: center; gap: 6px; transition: opacity 0.2s, transform 0.15s; box-shadow: 0 4px 12px rgba(26,63,168,0.25); }
        .admin-btn-add:hover { opacity: 0.9; transform: translateY(-1px); }
        .admin-table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        thead tr { background: #f8f9ff; border-bottom: 1px solid #e8eaf4; }
        th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; }
        td { padding: 14px 16px; border-bottom: 1px solid #f0f2fa; color: #1a1a2e; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fafbff; }
        .tipe-badge { background: rgba(26,63,168,0.08); color: #1a3fa8; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
        .unit-control { display: flex; align-items: center; gap: 8px; }
        .unit-btn { width: 26px; height: 26px; border-radius: 6px; border: 1.5px solid #e0e4f0; background: #f8f9ff; font-size: 14px; font-weight: 700; color: #1a3fa8; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s, border-color 0.15s; }
        .unit-btn:hover { background: rgba(26,63,168,0.08); border-color: #1a3fa8; }
        .unit-value { font-weight: 700; min-width: 20px; text-align: center; }
        .tersedia-badge { font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
        .tersedia-badge.ok { background: rgba(34,197,94,0.1); color: #16a34a; }
        .tersedia-badge.low { background: rgba(234,179,8,0.1); color: #ca8a04; }
        .tersedia-badge.empty { background: rgba(239,68,68,0.1); color: #dc2626; }
        .action-btns { display: flex; gap: 6px; }
        .btn-edit { background: rgba(26,63,168,0.08); color: #1a3fa8; border: none; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.15s; }
        .btn-edit:hover { background: rgba(26,63,168,0.15); }
        .btn-delete { background: rgba(239,68,68,0.08); color: #dc2626; border: none; border-radius: 8px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.15s; }
        .btn-delete:hover { background: rgba(239,68,68,0.15); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(10,15,40,0.5); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1rem; animation: fadeIn 0.15s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-card { background: #fff; border-radius: 20px; width: 100%; max-width: 480px; padding: 2rem; box-shadow: 0 24px 64px rgba(0,0,0,0.2); animation: slideUp 0.2s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .modal-title { font-size: 1.1rem; font-weight: 800; color: #1a1a2e; margin: 0 0 1.25rem; }
        .modal-form { display: flex; flex-direction: column; gap: 12px; }
        .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .modal-field { display: flex; flex-direction: column; gap: 5px; }
        .modal-field.full { grid-column: 1 / -1; }
        .modal-field label { font-size: 12px; font-weight: 600; color: #555; }
        .modal-input { padding: 10px 12px; border: 1.5px solid #e0e4f0; border-radius: 8px; font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif; color: #1a1a2e; background: #f8f9ff; outline: none; transition: border-color 0.2s; width: 100%; }
        .modal-input:focus { border-color: #1a3fa8; background: #fff; }
        .modal-error { background: #fff0f0; border: 1px solid #ffcccc; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #c0392b; }
        .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px; }
        .btn-cancel { background: #f0f2f8; color: #555; border: none; border-radius: 10px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: background 0.15s; }
        .btn-cancel:hover { background: #e0e4f0; }
        .btn-confirm { background: linear-gradient(135deg, #1a3fa8, #8b3cc4); color: #fff; border: none; border-radius: 10px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: opacity 0.2s; box-shadow: 0 4px 12px rgba(26,63,168,0.25); }
        .btn-confirm:hover { opacity: 0.9; }
        .btn-confirm:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-confirm-delete { background: linear-gradient(135deg, #dc2626, #b91c1c); color: #fff; border: none; border-radius: 10px; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; box-shadow: 0 4px 12px rgba(220,38,38,0.25); }
        .delete-warning { background: #fff5f5; border: 1px solid #fecaca; border-radius: 10px; padding: 12px 14px; font-size: 13px; color: #dc2626; margin-bottom: 1rem; }
        .empty-state { text-align: center; padding: 4rem; color: #aaa; }
        .empty-state p { font-size: 14px; margin-top: 8px; }
        .loading-wrap { display: flex; align-items: center; justify-content: center; padding: 4rem; color: #888; font-size: 14px; gap: 10px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 20px; height: 20px; border: 2px solid #e0e4f0; border-top-color: #1a3fa8; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @media (max-width: 1024px) { .admin-stats { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <div className="admin-page">
        {/* SIDEBAR */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-logo">
            <img src="/src/assets/LOGO_PPS.jpeg" alt="PPS" />
            <div className="admin-sidebar-logo-text">
              <strong>PPS Admin</strong>
              <span>Dashboard</span>
            </div>
          </div>
          <nav className="admin-sidebar-nav">
            <div className="admin-nav-label">Menu</div>
            <button className="admin-nav-item active">
              <span className="admin-nav-item-icon">🚗</span>Manajemen Mobil
            </button>
            <button className="admin-nav-item">
              <span className="admin-nav-item-icon">📋</span>Data Pesanan
            </button>
            <button className="admin-nav-item">
              <span className="admin-nav-item-icon">👥</span>Data Pengguna
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

        {/* MAIN */}
        <main className="admin-main">
          <div className="admin-topbar">
            <div>
              <h1>Manajemen Armada</h1>
              <p>Kelola data kendaraan rental PPS</p>
            </div>
          </div>

          {/* STATS */}
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
              <div className="admin-stat-icon">🔑</div>
              <div className="admin-stat-label">Sedang Disewa</div>
              <div className="admin-stat-value" style={{ color: "#c0392b" }}>{sedangDisewa}</div>
              <div className="admin-stat-sub">unit aktif</div>
            </div>
          </div>

          {/* TABLE */}
          <div className="admin-table-section">
            <div className="admin-table-header">
              <h2>Daftar Kendaraan</h2>
              <div className="admin-table-controls">
                <input className="admin-search" type="text" placeholder="Cari nama mobil..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <select className="admin-filter-select" value={filterTipe} onChange={(e) => setFilterTipe(e.target.value)}>
                  <option value="Semua">Semua Tipe</option>
                  {TIPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <button className="admin-btn-add" onClick={openAdd}>＋ Tambah Mobil</button>
              </div>
            </div>

            <div className="admin-table-wrap">
              {loading ? (
                <div className="loading-wrap"><div className="spinner" /> Memuat data...</div>
              ) : filtered.length === 0 ? (
                <div className="empty-state">
                  <div style={{ fontSize: "3rem" }}>🚗</div>
                  <p>Tidak ada kendaraan ditemukan</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Kendaraan</th>
                      <th>Tipe</th>
                      <th>Harga/Hari</th>
                      <th>Kursi</th>
                      <th>Total Unit</th>
                      <th>Tersedia</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((m, i) => (
                      <tr key={m.id_mobil}>
                        <td style={{ color: "#aaa", fontWeight: 500 }}>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{m.nama}</td>
                        <td><span className="tipe-badge">{m.tipe}</span></td>
                        <td style={{ fontWeight: 700, color: "#1a3fa8" }}>Rp {m.harga.toLocaleString("id-ID")}</td>
                        <td>{m.kursi} kursi</td>
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
        </main>
      </div>

      {/* MODAL ADD / EDIT */}
      {(modal === "add" || modal === "edit") && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-card">
            <h2 className="modal-title">{modal === "add" ? "Tambah Kendaraan Baru" : "Edit Kendaraan"}</h2>
            <div className="modal-form">
              {error && <div className="modal-error">{error}</div>}
              <div className="modal-grid">
                <div className="modal-field full">
                  <label>Nama Kendaraan</label>
                  <input className="modal-input" type="text" placeholder="Toyota Innova" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
                </div>
                <div className="modal-field">
                  <label>Tipe</label>
                  <select className="modal-input" value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value })}>
                    {TIPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="modal-field">
                  <label>Jumlah Kursi</label>
                  <input className="modal-input" type="number" min={1} value={form.kursi} onChange={(e) => setForm({ ...form, kursi: Number(e.target.value) })} />
                </div>
                <div className="modal-field">
                  <label>Harga per Hari (Rp)</label>
                  <input className="modal-input" type="number" min={0} value={form.harga} onChange={(e) => setForm({ ...form, harga: Number(e.target.value) })} />
                </div>
                <div className="modal-field">
                  <label>Total Unit</label>
                  <input className="modal-input" type="number" min={0} value={form.totalUnit} onChange={(e) => setForm({ ...form, totalUnit: Number(e.target.value) })} />
                </div>
                <div className="modal-field full">
                  <label>URL Gambar (opsional)</label>
                  <input className="modal-input" type="text" placeholder="https://..." value={form.gambar} onChange={(e) => setForm({ ...form, gambar: e.target.value })} />
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setModal(null)}>Batal</button>
                <button className="btn-confirm" disabled={submitLoading} onClick={modal === "add" ? handleAdd : handleEdit}>
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
            <div className="delete-warning">
              ⚠️ Kamu akan menghapus <strong>{selected?.nama}</strong>. Tindakan ini tidak bisa dibatalkan.
            </div>
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
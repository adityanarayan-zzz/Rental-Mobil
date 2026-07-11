import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const priceRanges = [
  { label: "Semua Harga", min: 0, max: Infinity },
  { label: "< Rp 300.000", min: 0, max: 299999 },
  { label: "Rp 300.000 - 500.000", min: 300000, max: 500000 },
  { label: "> Rp 500.000", min: 500001, max: Infinity },
];

export default function DaftarMobil() {
  const navigate = useNavigate();
  const [mobils, setMobils] = useState<Mobil[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePriceIdx, setActivePriceIdx] = useState(0);

  useEffect(() => {
    fetchMobil();
  }, []);

  async function fetchMobil() {
    try {
      const res = await fetch(`${API_URL}/api/mobil`);
      const data = await res.json();
      setMobils(data.mobils);
    } catch {
      console.error("Gagal fetch mobil");
    } finally {
      setLoading(false);
    }
  }

  const filtered = mobils.filter((car) => {
    const range = priceRanges[activePriceIdx];
    return car.harga >= range.min && car.harga <= range.max;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .daftar-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          background: #f8f9ff;
          padding-top: 64px;
        }

        .daftar-header {
          background: linear-gradient(135deg, #1a3fa8 0%, #3b5fd4 30%, #8b3cc4 65%, #c0392b 100%);
          padding: 3rem 6rem 4rem;
          position: relative;
          overflow: hidden;
        }

        .daftar-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%);
          pointer-events: none;
        }

        .daftar-header h1 {
          font-size: 2.2rem;
          font-weight: 800;
          color: #fff;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
          position: relative;
        }

        .daftar-header p {
          font-size: 15px;
          color: rgba(255,255,255,0.7);
          margin: 0;
          position: relative;
        }

        .daftar-filter-wrap {
          background: #fff;
          border-bottom: 1px solid rgba(26,63,168,0.08);
          padding: 1.25rem 6rem;
          display: flex;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
          position: sticky;
          top: 64px;
          z-index: 100;
          box-shadow: 0 2px 16px rgba(26,63,168,0.06);
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-label {
          font-size: 12px;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        .filter-btn {
          background: none;
          border: 1.5px solid rgba(26,63,168,0.15);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 13px;
          font-weight: 500;
          color: #555;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.18s ease;
          white-space: nowrap;
        }

        .filter-btn:hover { border-color: #1a3fa8; color: #1a3fa8; background: rgba(26,63,168,0.04); }
        .filter-btn.active { background: linear-gradient(135deg, #1a3fa8, #8b3cc4); border-color: transparent; color: #fff; font-weight: 600; }

        .daftar-content { padding: 2.5rem 6rem; }

        .daftar-count { font-size: 13px; color: #888; margin-bottom: 1.5rem; font-weight: 500; }
        .daftar-count strong { color: #1a1a2e; }

        .car-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .car-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(26,63,168,0.08);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          cursor: pointer;
        }

        .car-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(26,63,168,0.13); }
        .car-card.habis { opacity: 0.6; cursor: not-allowed; }
        .car-card.habis:hover { transform: none; box-shadow: none; }

        .car-card-image {
          width: 100%;
          aspect-ratio: 16/10;
          background: linear-gradient(135deg, #e8eeff 0%, #f0e8ff 50%, #ffe8e8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .car-card-image img { width: 85%; height: 85%; object-fit: contain; transition: transform 0.3s ease; }
        .car-card:hover .car-card-image img { transform: scale(1.05); }
        .car-card-image .no-img { font-size: 4rem; opacity: 0.3; }

        .car-habis-badge {
          position: absolute;
          top: 12px; right: 12px;
          background: rgba(220,38,38,0.9);
          color: #fff;
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 600;
        }

        .car-card-body { padding: 1.25rem; }
        .car-card-name { font-size: 16px; font-weight: 700; color: #1a1a2e; margin: 0 0 4px; }

        .car-card-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1rem;
        }

        .car-card-meta span { font-size: 12px; color: #888; }

        .car-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1rem;
          border-top: 1px solid rgba(26,63,168,0.07);
        }

        .car-card-price { display: flex; flex-direction: column; gap: 1px; }
        .car-card-price span { font-size: 11px; color: #aaa; }
        .car-card-price strong { font-size: 17px; font-weight: 800; color: #1a3fa8; letter-spacing: -0.01em; }
        .car-card-price small { font-size: 11px; color: #888; font-weight: 400; }

        .btn-pesan {
          background: linear-gradient(135deg, #1a3fa8, #8b3cc4);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 9px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 12px rgba(26,63,168,0.25);
        }

        .btn-pesan:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-pesan:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        .daftar-empty { text-align: center; padding: 5rem 0; color: #aaa; }
        .daftar-empty p { font-size: 15px; margin-top: 8px; }

        .loading-wrap { display: flex; align-items: center; justify-content: center; padding: 5rem 0; color: #888; font-size: 14px; gap: 10px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 20px; height: 20px; border: 2px solid #e0e4f0; border-top-color: #1a3fa8; border-radius: 50%; animation: spin 0.7s linear infinite; }

        @media (max-width: 1024px) {
          .car-grid { grid-template-columns: repeat(2, 1fr); }
          .daftar-header, .daftar-filter-wrap, .daftar-content { padding-left: 2rem; padding-right: 2rem; }
        }

        @media (max-width: 640px) {
          .car-grid { grid-template-columns: 1fr; }
          .daftar-header { padding: 2rem; }
          .daftar-filter-wrap { padding: 1rem 1.5rem; gap: 1rem; }
        }
      `}</style>

      <div className="daftar-page">
        <div className="daftar-header">
          <h1>Daftar Armada</h1>
          <p>Pilih kendaraan yang sesuai kebutuhan perjalanan Anda</p>
        </div>

        <div className="daftar-filter-wrap">
          <div className="filter-group">
            <span className="filter-label">Harga</span>
            {priceRanges.map((r, i) => (
              <button key={i} className={`filter-btn${activePriceIdx === i ? " active" : ""}`} onClick={() => setActivePriceIdx(i)}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className="daftar-content">
          {loading ? (
            <div className="loading-wrap">
              <div className="spinner" />
              Memuat data kendaraan...
            </div>
          ) : (
            <>
              <p className="daftar-count">
                Menampilkan <strong>{filtered.length} mobil</strong>
              </p>

              {filtered.length === 0 ? (
                <div className="daftar-empty">
                  <div style={{ fontSize: "3rem" }}>🚗</div>
                  <p>Tidak ada mobil yang sesuai filter</p>
                </div>
              ) : (
                <div className="car-grid">
                  {filtered.map((car) => (
                    <div className={`car-card${!car.tersedia || car.unitTersedia === 0 ? " habis" : ""}`} key={car.id_mobil}>
                      <div className="car-card-image">
                        {car.gambar ? (
                          <img src={car.gambar} alt={car.nama} />
                        ) : (
                          <span className="no-img">🚗</span>
                        )}
                        {(!car.tersedia || car.unitTersedia === 0) && (
                          <div className="car-habis-badge">Habis</div>
                        )}
                      </div>
                      <div className="car-card-body">
                        <h3 className="car-card-name">{car.nama}</h3>
                        <div className="car-card-meta">
                          <span>{car.unitTersedia} unit tersedia</span>
                        </div>
                        <div className="car-card-footer">
                          <div className="car-card-price">
                            <div>
                              <strong>Rp {car.harga.toLocaleString("id-ID")}</strong>
                              <small> /hari</small>
                            </div>
                          </div>
                          <button
                            className="btn-pesan"
                            disabled={!car.tersedia || car.unitTersedia === 0}
                            onClick={() => navigate("/pesan", {
                              state: {
                                mobil: {
                                  id: car.id_mobil,
                                  name: car.nama,
                                  image: car.gambar || "",
                                  price: car.harga,
                                }
                              }
                            })}
                          >
                            {car.unitTersedia === 0 ? "Habis" : "Pesan"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
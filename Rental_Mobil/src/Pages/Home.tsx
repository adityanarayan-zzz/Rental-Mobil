export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .home {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          background: #f8f9ff;
          padding-top: 64px;
        }

        /* HERO */
        .hero {
          min-height: calc(100vh - 64px);
          display: flex;
          align-items: center;
          padding: 0 6rem;
          gap: 4rem;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: -120px;
          right: -120px;
          width: 520px;
          height: 520px;
          background: radial-gradient(circle, rgba(59,95,212,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero::after {
          content: '';
          position: absolute;
          bottom: -80px;
          left: -80px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(192,57,43,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        /* LEFT - Foto Mobil */
        .hero-image-wrap {
          flex: 1.1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-image-card {
          width: 100%;
          aspect-ratio: 4/3;
          background: linear-gradient(135deg, #e8eeff 0%, #f0e8ff 50%, #ffe8e8 100%);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(26,63,168,0.12);
        }

        .hero-image-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(26,63,168,0.04) 0%, rgba(139,60,196,0.04) 50%, rgba(192,57,43,0.04) 100%);
        }

        .hero-car-icon {
          width: 180px;
          height: 180px;
          opacity: 0.25;
        }

        .hero-placeholder-text {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          color: rgba(26,63,168,0.4);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .hero-badge {
          position: absolute;
          top: 1.25rem;
          left: 1.25rem;
          background: linear-gradient(135deg, #1a3fa8, #8b3cc4);
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 20px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .hero-floating-card {
          position: absolute;
          bottom: -16px;
          right: -16px;
          background: #fff;
          border-radius: 16px;
          padding: 14px 18px;
          box-shadow: 0 8px 32px rgba(26,63,168,0.14);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hero-floating-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #1a3fa8, #8b3cc4);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-floating-text p {
          font-size: 11px;
          color: #888;
          margin: 0;
        }

        .hero-floating-text strong {
          font-size: 14px;
          color: #1a1a2e;
          font-weight: 700;
        }

        /* RIGHT - Deskripsi */
        .hero-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          z-index: 1;
        }

        .hero-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(26,63,168,0.08);
          color: #1a3fa8;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 20px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          width: fit-content;
        }

        .hero-label span {
          width: 6px;
          height: 6px;
          background: #1a3fa8;
          border-radius: 50%;
          display: inline-block;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          color: #1a1a2e;
          line-height: 1.15;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .hero-title .highlight {
          background: linear-gradient(135deg, #1a3fa8 0%, #8b3cc4 50%, #c0392b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-desc {
          font-size: 16px;
          color: #555;
          line-height: 1.7;
          margin: 0;
          max-width: 420px;
        }

        .hero-stats {
          display: flex;
          gap: 2rem;
        }

        .hero-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .hero-stat strong {
          font-size: 1.6rem;
          font-weight: 800;
          color: #1a1a2e;
          letter-spacing: -0.02em;
        }

        .hero-stat span {
          font-size: 12px;
          color: #888;
          font-weight: 500;
        }

        .hero-stat-divider {
          width: 1px;
          background: #e0e0e8;
          align-self: stretch;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .btn-primary {
          background: linear-gradient(135deg, #1a3fa8 0%, #8b3cc4 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 20px rgba(26,63,168,0.3);
        }

        .btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(26,63,168,0.35);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-secondary {
          background: transparent;
          color: #1a3fa8;
          border: 1.5px solid rgba(26,63,168,0.25);
          border-radius: 12px;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }

        .btn-secondary:hover {
          background: rgba(26,63,168,0.06);
          border-color: rgba(26,63,168,0.5);
          transform: translateY(-1px);
        }

        /* FEATURES */
        .features {
          padding: 5rem 6rem;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .feature-card {
          background: #fff;
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(26,63,168,0.08);
          transition: transform 0.25s, box-shadow 0.25s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(26,63,168,0.1);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          font-size: 22px;
        }

        .feature-card h3 {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 8px;
        }

        .feature-card p {
          font-size: 14px;
          color: #777;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 900px) {
          .hero { padding: 2rem; flex-direction: column; }
          .hero-title { font-size: 2rem; }
          .features { padding: 2rem; grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="home">
        {/* HERO */}
        <section className="hero">
          {/* Kiri - Foto Mobil */}
          <div className="hero-image-wrap">
            <div className="hero-image-card">
              <svg className="hero-car-icon" viewBox="0 0 24 24" fill="#1a3fa8">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
              <p className="hero-placeholder-text">Foto mobil akan ditampilkan di sini</p>
            </div>

            {/* Floating card */}
            <div className="hero-floating-card">
              <div className="hero-floating-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div className="hero-floating-text">
                <p>Tersedia di</p>
                <strong>Seluruh Indonesia</strong>
              </div>
            </div>
          </div>

          {/* Kanan - Deskripsi */}
          <div className="hero-content">
            <div className="hero-label">
              <span></span>
              Rental Mobil Terpercaya
            </div>

            <h1 className="hero-title">
              Perjalanan Nyaman<br />
              Dimulai dari <span className="highlight">PPS</span>
            </h1>

            <p className="hero-desc">
              Dapatkan pengalaman berkendara terbaik dengan armada mobil premium kami.
              Harga transparan, pengemudi profesional, dan siap melayani 24 jam untuk
              setiap perjalanan Anda.
            </p>

            <div className="hero-stats">
              <div className="hero-stat">
                <strong>500+</strong>
                <span>Armada Mobil</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong>10K+</strong>
                <span>Pelanggan Puas</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong>24/7</strong>
                <span>Layanan Aktif</span>
              </div>
            </div>

            <div className="hero-actions">
              <button className="btn-primary">Sewa Sekarang</button>
              <button className="btn-secondary">Lihat Armada</button>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features">
          <div className="feature-card">
            <div className="feature-icon" style={{ background: "rgba(26,63,168,0.08)" }}>🚗</div>
            <h3>Armada Lengkap</h3>
            <p>Pilihan mobil dari MPV, SUV, hingga sedan premium tersedia untuk semua kebutuhan perjalanan Anda.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: "rgba(139,60,196,0.08)" }}>🛡️</div>
            <h3>Aman & Terjamin</h3>
            <p>Semua armada dilengkapi asuransi penuh dan melewati pengecekan rutin demi keselamatan Anda.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: "rgba(192,57,43,0.08)" }}>⚡</div>
            <h3>Pemesanan Cepat</h3>
            <p>Pesan dalam hitungan menit, konfirmasi instan, dan mobil siap di depan pintu Anda tepat waktu.</p>
          </div>
        </section>
      </div>
    </>
  );
}

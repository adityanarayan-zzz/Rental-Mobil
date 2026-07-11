import { useState } from "react";
import { API_URL } from "../utils/api";

interface authModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: authModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function validatePassword(value: string) {
    if (value.length < 8) {
      setPasswordError("Password minimal 8 karakter");
    } else if (!/[A-Z]/.test(value)) {
      setPasswordError("Harus mengandung huruf kapital");
    } else if (!/[0-9]/.test(value)) {
      setPasswordError("Harus mengandung angka");
    } else {
      setPasswordError("");
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onClose();

      if (email.includes("@admin")) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        window.location.href = "/admin/dashboard";
      } else {
        window.location.reload();
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    if (!/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(password)) {
      setError("Password minimal 8 karakter, harus mengandung huruf kapital dan angka");
      return;
    }

    setLoading(true);

    const username = (form.elements.namedItem("username") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const NoWA = (form.elements.namedItem("NoWA") as HTMLInputElement).value;

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, NoWA }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onClose();
      window.location.reload();
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .auth-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10, 15, 40, 0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .auth-modal {
          background: #fff;
          border-radius: 24px;
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
          position: relative;
          box-shadow: 0 32px 80px rgba(26,63,168,0.18);
          animation: slideUp 0.25s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .auth-close {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: #f0f2f8;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #555;
          transition: background 0.15s;
        }

        .auth-close:hover { background: #e0e4f0; }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 1.5rem;
        }

        .auth-logo img {
          width: 36px;
          height: 36px;
          object-fit: contain;
          border-radius: 8px;
        }

        .auth-logo-text strong {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #1a1a2e;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .auth-logo-text span {
          font-size: 10px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .auth-tabs {
          display: flex;
          background: #f0f2f8;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 1.75rem;
        }

        .auth-tab {
          flex: 1;
          padding: 9px;
          border: none;
          background: none;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #888;
          transition: all 0.2s ease;
        }

        .auth-tab.active {
          background: #fff;
          color: #1a1a2e;
          box-shadow: 0 2px 8px rgba(26,63,168,0.1);
        }

        .auth-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #1a1a2e;
          margin: 0 0 4px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: -0.01em;
        }

        .auth-subtitle {
          font-size: 13px;
          color: #888;
          margin: 0 0 1.5rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .auth-field label {
          font-size: 13px;
          font-weight: 600;
          color: #444;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .auth-input-wrap { position: relative; }

        .auth-input {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e0e4f0;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1a1a2e;
          background: #f8f9ff;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          outline: none;
        }

        .auth-input:focus {
          border-color: #1a3fa8;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(26,63,168,0.08);
        }

        .auth-input.error { border-color: #c0392b; }
        .auth-input::placeholder { color: #bbb; }

        .auth-eye {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #aaa;
          font-size: 16px;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .auth-password-hint {
          font-size: 11px;
          color: #aaa;
          margin-top: 2px;
          line-height: 1.4;
        }

        .auth-password-error {
          font-size: 12px;
          color: #c0392b;
          margin-top: 2px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .auth-password-ok {
          font-size: 12px;
          color: #16a34a;
          margin-top: 2px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .auth-forgot {
          text-align: right;
          margin-top: -6px;
        }

        .auth-forgot a {
          font-size: 12px;
          color: #1a3fa8;
          text-decoration: none;
          font-weight: 500;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .auth-forgot a:hover { text-decoration: underline; }

        .auth-error {
          background: #fff0f0;
          border: 1px solid #ffcccc;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #c0392b;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .auth-btn-submit {
          background: linear-gradient(135deg, #1a3fa8 0%, #8b3cc4 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 13px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 16px rgba(26,63,168,0.28);
          margin-top: 4px;
        }

        .auth-btn-submit:hover { opacity: 0.9; transform: translateY(-1px); }
        .auth-btn-submit:active { transform: scale(0.98); }
        .auth-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0;
        }

        .auth-divider-line {
          flex: 1;
          height: 1px;
          background: #e0e4f0;
        }

        .auth-divider span {
          font-size: 12px;
          color: #aaa;
          font-family: 'Plus Jakarta Sans', sans-serif;
          white-space: nowrap;
        }

        .auth-btn-google {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #fff;
          border: 1.5px solid #e0e4f0;
          border-radius: 12px;
          padding: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.18s, border-color 0.18s, transform 0.15s;
          width: 100%;
        }

        .auth-btn-google:hover {
          background: #f8f9ff;
          border-color: #c0c8e0;
          transform: translateY(-1px);
        }

        .auth-terms {
          font-size: 11px;
          color: #aaa;
          text-align: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          line-height: 1.5;
          margin-top: 4px;
        }

        .auth-terms a { color: #1a3fa8; text-decoration: none; }
      `}</style>

      <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="auth-modal">
          <button className="auth-close" onClick={onClose}>✕</button>

          <div className="auth-logo">
            <img src="/src/assets/LOGO_PPS.jpeg" alt="PPS" />
            <div className="auth-logo-text">
              <strong>PPS</strong>
            </div>
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab${tab === "login" ? " active" : ""}`}
              onClick={() => { setTab("login"); setError(""); setPasswordError(""); }}
            >
              Masuk
            </button>
            <button
              className={`auth-tab${tab === "register" ? " active" : ""}`}
              onClick={() => { setTab("register"); setError(""); setPasswordError(""); }}
            >
              Daftar
            </button>
          </div>

          {error && <div className="auth-error" style={{ marginBottom: "12px" }}>{error}</div>}

          {tab === "login" ? (
            <>
              <h2 className="auth-title">Selamat Datang!</h2>
              <form className="auth-form" onSubmit={handleLogin}>
                <div className="auth-field">
                  <label>Email</label>
                  <div className="auth-input-wrap">
                    <input name="email" className="auth-input" type="email" placeholder="@email.com" required />
                  </div>
                </div>
                <div className="auth-field">
                  <label>Password</label>
                  <div className="auth-input-wrap">
                    <input
                      name="password"
                      className="auth-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      style={{ paddingRight: "40px" }}
                      required
                    />
                    <button type="button" className="auth-eye" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <button type="submit" className="auth-btn-submit" disabled={loading}>
                  {loading ? "Memproses..." : "Masuk"}
                </button>
                <div className="auth-divider">
                  <div className="auth-divider-line" />
                  <span>atau masuk dengan</span>
                  <div className="auth-divider-line" />
                </div>
<button
  type="button"
  className="auth-btn-google"
  onClick={() => window.location.href = `${API_URL}/api/auth/google`}
>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Masuk dengan Google
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="auth-title">Buat Akun Baru</h2>
              <form className="auth-form" onSubmit={handleRegister}>
                <div className="auth-field">
                  <label>Username</label>
                  <input name="username" className="auth-input" type="text" placeholder="Username kamu" required />
                </div>
                <div className="auth-field">
                  <label>Email</label>
                  <input name="email" className="auth-input" type="email" placeholder="@email.com" required />
                </div>
                <div className="auth-field">
                  <label>No. WhatsApp</label>
                  <input name="NoWA" className="auth-input" type="tel" />
                </div>
                <div className="auth-field">
                  <label>Password</label>
                  <div className="auth-input-wrap">
                    <input
                      name="password"
                      className={`auth-input${passwordError ? " error" : ""}`}
                      type={showPassword ? "text" : "password"}
                      style={{ paddingRight: "40px" }}
                      onChange={(e) => validatePassword(e.target.value)}
                      required
                    />
                    <button type="button" className="auth-eye" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {passwordError ? (
                    <p className="auth-password-error">⚠ {passwordError}</p>
                  ) : (
                    <p className="auth-password-hint">Min. 8 karakter, mengandung huruf kapital dan angka</p>
                  )}
                </div>
                <button type="submit" className="auth-btn-submit" disabled={loading || !!passwordError}>
                  {loading ? "Memproses..." : "Daftar Sekarang"}
                </button>
                <p className="auth-terms">
                  Dengan mendaftar, kamu menyetujui <a href="#">Syarat & Ketentuan</a> dan <a href="#">Kebijakan Privasi</a> kami.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
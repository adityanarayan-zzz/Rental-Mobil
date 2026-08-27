import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
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
      if (!res.ok) { setError(data.message); return; }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (email.includes("@admin")) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        navigate("/admin/dashboard");
      } else {
        navigate("/");
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
      if (!res.ok) { setError(data.message); return; }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
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
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-page {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .login-left {
          background: linear-gradient(135deg, #1a3fa8 0%, #3b5fd4 30%, #8b3cc4 65%, #c0392b 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 4rem;
          position: relative;
          overflow: hidden;
        }

        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .login-brand { position: relative; z-index: 1; }

        .login-brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 3rem;
        }

        .login-brand-logo img {
          width: 48px;
          height: 48px;
          object-fit: contain;
          border-radius: 12px;
          border: 2px solid rgba(255,255,255,0.3);
        }

        .login-brand-logo-text strong {
          display: block;
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .login-brand-logo-text span {
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .login-brand h1 {
          font-size: 2.4rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
        }

        .login-brand p {
          font-size: 15px;
          color: rgba(255,255,255,0.65);
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }

        .login-features { display: flex; flex-direction: column; gap: 14px; }

        .login-feature {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .login-feature-icon {
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.12);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.15);
        }

        .login-feature-text {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
        }

        .login-right {
          background: #f8f9ff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
        }

        .login-form-wrap {
          width: 100%;
          max-width: 420px;
        }

        .login-form-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #1a1a2e;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }

        .login-form-sub {
          font-size: 14px;
          color: #888;
          margin-bottom: 2rem;
        }

        .login-tabs {
          display: flex;
          background: #e8eaf4;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 1.75rem;
        }

        .login-tab {
          flex: 1;
          padding: 10px;
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

        .login-tab.active {
          background: #fff;
          color: #1a1a2e;
          box-shadow: 0 2px 8px rgba(26,63,168,0.1);
        }

        .login-error {
          background: #fff0f0;
          border: 1px solid #ffcccc;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #c0392b;
          margin-bottom: 1rem;
        }

        .login-form { display: flex; flex-direction: column; gap: 16px; }

        .login-field { display: flex; flex-direction: column; gap: 6px; }

        .login-field label {
          font-size: 13px;
          font-weight: 600;
          color: #444;
        }

        .login-input-wrap { position: relative; }

        .login-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e0e4f0;
          border-radius: 12px;
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1a1a2e;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .login-input:focus {
          border-color: #1a3fa8;
          box-shadow: 0 0 0 3px rgba(26,63,168,0.08);
        }

        .login-input::placeholder { color: #bbb; }
        .login-input.error { border-color: #c0392b; }

        .login-eye {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #aaa;
          display: flex;
          align-items: center;
          padding: 0;
        }

        .password-hint { font-size: 12px; color: #aaa; margin-top: 4px; }
        .password-error { font-size: 12px; color: #c0392b; margin-top: 4px; }

        .login-forgot { text-align: right; margin-top: -8px; }
        .login-forgot a {
          font-size: 12px;
          color: #1a3fa8;
          text-decoration: none;
          font-weight: 500;
        }
        .login-forgot a:hover { text-decoration: underline; }

        .login-btn {
          background: linear-gradient(135deg, #1a3fa8 0%, #8b3cc4 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 16px rgba(26,63,168,0.28);
          margin-top: 4px;
        }

        .login-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0;
        }

        .login-divider-line { flex: 1; height: 1px; background: #e0e4f0; }

        .login-divider span {
          font-size: 12px;
          color: #aaa;
          white-space: nowrap;
        }

        .login-btn-google {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #fff;
          border: 1.5px solid #e0e4f0;
          border-radius: 12px;
          padding: 13px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.18s, border-color 0.18s, transform 0.15s;
          width: 100%;
        }

        .login-btn-google:hover {
          background: #f8f9ff;
          border-color: #c0c8e0;
          transform: translateY(-1px);
        }

        .login-terms {
          font-size: 11px;
          color: #aaa;
          text-align: center;
          line-height: 1.5;
          margin-top: 4px;
        }

        .login-terms a { color: #1a3fa8; text-decoration: none; }

        .login-back {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #888;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          margin-bottom: 1.5rem;
          transition: color 0.15s;
          cursor: pointer;
          background: none;
          border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 0;
        }

        .login-back:hover { color: #1a3fa8; }

        @media (max-width: 768px) {
          .login-page { grid-template-columns: 1fr; }
          .login-left { display: none; }
          .login-right { padding: 2rem 1.5rem; align-items: flex-start; padding-top: 3rem; }
        }
      `}</style>

      <div className="login-page">
        {/* LEFT PANEL */}

        {/* RIGHT PANEL */}
        <div className="login-right">
          <div className="login-form-wrap">
            <button className="login-back" onClick={() => window.history.back()}>
              ← Kembali
            </button>

            <div className="login-tabs">
              <button
                className={`login-tab${tab === "login" ? " active" : ""}`}
                onClick={() => { setTab("login"); setError(""); setPasswordError(""); }}
              >
                Masuk
              </button>
              <button
                className={`login-tab${tab === "register" ? " active" : ""}`}
                onClick={() => { setTab("register"); setError(""); setPasswordError(""); }}
              >
                Daftar
              </button>
            </div>

            {error && <div className="login-error">{error}</div>}

            {tab === "login" ? (
              <>
                <h1 className="login-form-title">Selamat Datang!</h1>
                <p className="login-form-sub">Masuk ke akun PPS kamu</p>
                <form className="login-form" onSubmit={handleLogin}>
                  <div className="login-field">
                    <label>Email</label>
                    <input name="email" className="login-input" type="email" placeholder="contoh@email.com" required />
                  </div>
                  <div className="login-field">
                    <label>Password</label>
                    <div className="login-input-wrap">
                      <input
                        name="password"
                        className="login-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        style={{ paddingRight: "44px" }}
                        required
                      />
                      <button type="button" className="login-eye" onClick={() => setShowPassword(!showPassword)}>
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
                  <div className="login-forgot"><a href="#">Lupa password?</a></div>
                  <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? "Memproses..." : "Masuk"}
                  </button>
                  <div className="login-divider">
                    <div className="login-divider-line" />
                    <span>atau masuk dengan</span>
                    <div className="login-divider-line" />
                  </div>
                  <button type="button" className="login-btn-google" onClick={() => window.location.href = `${API_URL}/api/auth/google`}>
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
                <h1 className="login-form-title">Buat Akun Baru</h1>
                <p className="login-form-sub">Daftar dan mulai perjalanan bersama PPS</p>
                <form className="login-form" onSubmit={handleRegister}>
                  <div className="login-field">
                    <label>Username</label>
                    <input name="username" className="login-input" type="text" placeholder="Username kamu" required />
                  </div>
                  <div className="login-field">
                    <label>Email</label>
                    <input name="email" className="login-input" type="email" placeholder="contoh@email.com" required />
                  </div>
                  <div className="login-field">
                    <label>No. WhatsApp</label>
                    <input name="NoWA" className="login-input" type="tel" placeholder="08xxxxxxxxxx" inputMode="numeric"
                      onChange={(e) => { e.target.value = e.target.value.replace(/[^0-9]/g, ""); }} />
                  </div>
                  <div className="login-field">
                    <label>Password</label>
                    <div className="login-input-wrap">
                      <input
                        name="password"
                        className={`login-input${passwordError ? " error" : ""}`}
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 karakter, huruf kapital & angka"
                        style={{ paddingRight: "44px" }}
                        onChange={(e) => validatePassword(e.target.value)}
                        required
                      />
                      <button type="button" className="login-eye" onClick={() => setShowPassword(!showPassword)}>
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
                      <p className="password-error">⚠ {passwordError}</p>
                    ) : (
                      <p className="password-hint">Min. 8 karakter, mengandung huruf kapital dan angka</p>
                    )}
                  </div>
                  <button type="submit" className="login-btn" disabled={loading || !!passwordError}>
                    {loading ? "Memproses..." : "Daftar Sekarang"}
                  </button>
                  <div className="login-divider">
                    <div className="login-divider-line" />
                    <span>atau daftar dengan</span>
                    <div className="login-divider-line" />
                  </div>
                  <button type="button" className="login-btn-google" onClick={() => window.location.href = `${API_URL}/api/auth/google`}>
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Daftar dengan Google
                  </button>
                  <p className="login-terms">
                    Dengan mendaftar, kamu menyetujui <a href="#">Syarat & Ketentuan</a> dan <a href="#">Kebijakan Privasi</a> kami.
                  </p>
                </form>
              </> 
            )}
          </div>
        </div>
      </div>
    </>
  );
}
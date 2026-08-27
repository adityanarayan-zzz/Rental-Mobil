import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/LOGO_PPS.jpeg";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Daftar Mobil", href: "/daftar-mobil" },
  { label: "Pesan", href: "/pesan" },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setUser(null);
    window.location.href = "/";
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .navbar {
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 0 2.5rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #1a3fa8 0%, #3b5fd4 30%, #8b3cc4 65%, #c0392b 100%);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 4px 24px rgba(26,63,168,0.2);
          transition: box-shadow 0.4s ease;
        }

        .navbar.scrolled {
          box-shadow: 0 8px 32px rgba(26,63,168,0.35);
          border-bottom: 1px solid rgba(255,255,255,0.18);
        }

        .navbar::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%);
          pointer-events: none;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          z-index: 1;
        }

        .navbar-logo-img {
          width: 40px;
          height: 40px;
          object-fit: contain;
          border-radius: 8px;
          transition: transform 0.3s ease;
        }

        .navbar-logo:hover .navbar-logo-img { transform: scale(1.05); }

        .navbar-logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .navbar-logo-title {
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.01em;
        }

        .navbar-logo-sub {
          font-size: 10px;
          font-weight: 400;
          color: rgba(255,255,255,0.65);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .navbar-right {
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .navbar-link {
          position: relative;
          color: rgba(255,255,255,0.78);
          font-size: 14px;
          font-weight: 500;
          padding: 7px 15px;
          border-radius: 8px;
          cursor: pointer;
          background: none;
          border: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: 0.01em;
          transition: color 0.2s ease;
          overflow: hidden;
          text-decoration: none;
        }

        .navbar-link::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 8px;
          background: rgba(255,255,255,0.12);
          opacity: 0;
          transform: scale(0.85);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .navbar-link:hover { color: #fff; }
        .navbar-link:hover::before { opacity: 1; transform: scale(1); }

        .navbar-link.active { color: #fff; font-weight: 600; }
        .navbar-link.active::before { opacity: 1; transform: scale(1); background: rgba(255,255,255,0.18); }

        .navbar-link::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 16px;
          height: 2px;
          background: rgba(255,255,255,0.8);
          border-radius: 2px;
          transition: transform 0.25s ease;
        }

        .navbar-link.active::after { transform: translateX(-50%) scaleX(1); }

        .navbar-divider {
          width: 1px;
          height: 20px;
          background: rgba(255,255,255,0.22);
          margin: 0 10px;
        }

        .navbar-btn-login {
          position: relative;
          background: rgba(255,255,255,0.1);
          color: #fff;
          border: 1.5px solid rgba(255,255,255,0.35);
          border-radius: 8px;
          padding: 8px 22px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          letter-spacing: 0.01em;
          overflow: hidden;
          transition: border-color 0.25s ease, transform 0.15s ease, background 0.25s ease;
        }

        .navbar-btn-login:hover {
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.6);
        }

        .navbar-btn-login:active { transform: scale(0.97); }

        .navbar-user {
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 1;
        }

        .navbar-user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: 1.5px solid rgba(255,255,255,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .navbar-user-name { font-size: 14px; font-weight: 600; color: #fff; }

        .navbar-btn-logout {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border: 1.5px solid rgba(255,255,255,0.35);
          border-radius: 8px;
          padding: 7px 14px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.2s, border-color 0.2s;
        }

        .navbar-btn-logout:hover {
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.6);
        }

        .navbar-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 6px;
          z-index: 1;
        }

        .navbar-hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: rgba(255,255,255,0.9);
          border-radius: 2px;
          transition: all 0.25s ease;
        }

        .navbar-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .navbar-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .navbar-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .navbar-mobile-menu {
          display: none;
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          background: linear-gradient(160deg, rgba(26,63,168,0.75) 0%, rgba(122,53,184,0.75) 60%, rgba(176,48,32,0.75) 100%);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.12);
          padding: 1rem;
          flex-direction: column;
          gap: 4px;
          z-index: 999;
          box-shadow: 0 12px 32px rgba(0,0,0,0.2);
        }

        .navbar-mobile-menu.open { display: flex; }

        .navbar-mobile-link {
          color: rgba(255,255,255,0.85);
          font-size: 15px;
          font-weight: 500;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: none;
          border: none;
          text-align: left;
          width: 100%;
          transition: background 0.2s ease, color 0.2s ease;
          text-decoration: none;
          display: block;
        }

        .navbar-mobile-link:hover, .navbar-mobile-link.active {
          background: rgba(255,255,255,0.15);
          color: #fff;
        }

        .navbar-mobile-login {
          margin-top: 8px;
          background: rgba(255,255,255,0.12);
          color: #fff;
          border: 1.5px solid rgba(255,255,255,0.35);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          text-align: left;
          width: 100%;
          transition: background 0.2s ease;
        }

        .navbar-mobile-login:hover { background: rgba(255,255,255,0.22); }

        @media (max-width: 640px) {
          .navbar-links, .navbar-divider, .navbar-btn-login, .navbar-user { display: none; }
          .navbar-hamburger { display: flex; }
        }
      `}</style>

      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <Link className="navbar-logo" to="/">
          <img src={logo} alt="Logo PPS" className="navbar-logo-img" />
          <div className="navbar-logo-text">
            <span className="navbar-logo-title">PPS</span>
            <span className="navbar-logo-sub">Rental Car</span>
          </div>
        </Link>

        <div className="navbar-right">
          <div className="navbar-links">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`navbar-link${location.pathname === link.href ? " active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="navbar-divider" />

          {user ? (
            <div className="navbar-user">
              <div className="navbar-user-avatar">
                {user.username.charAt(0)}
              </div>
              <span className="navbar-user-name">{user.username}</span>
              <button className="navbar-btn-logout" onClick={handleLogout}>Keluar</button>
            </div>
          ) : (
            <button className="navbar-btn-login" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>

        <button
          className={`navbar-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <div className={`navbar-mobile-menu${menuOpen ? " open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`navbar-mobile-link${location.pathname === link.href ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button className="navbar-mobile-login" onClick={handleLogout}>Keluar</button>
          ) : (
            <button className="navbar-mobile-login" onClick={() => { navigate("/login"); setMenuOpen(false); }}>
              Login
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import DaftarMobil from "./Pages/DaftarMobil";
import Pesan from "./Pages/Pesan";
import Admindashboard from "./Pages/Admindashboard";

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = params.get("user");

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", decodeURIComponent(user));

      // Bersihkan URL
      window.history.replaceState({}, "", "/");

      // Cek admin
      const userData = JSON.parse(decodeURIComponent(user));
      if (userData.email?.includes("@admin")) {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminUser", decodeURIComponent(user));
        navigate("/admin/dashboard");
      }
    }
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daftar-mobil" element={<DaftarMobil />} />
        <Route path="/pesan" element={<Pesan />} />
        <Route path="/admin/dashboard" element={<Admindashboard />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
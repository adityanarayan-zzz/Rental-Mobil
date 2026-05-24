import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import DaftarMobil from "./Pages/DaftarMobil";
import Pesan from "./Pages/Pesan";
import Admindashboard from "./Pages/Admindashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daftar-mobil" element={<DaftarMobil />} />
        <Route path="/pesan" element={<Pesan />} />
        <Route path="/admin/dashboard" element={<Admindashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
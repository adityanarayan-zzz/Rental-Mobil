import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import DaftarMobil from "./Pages/DaftarMobil";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/daftar-mobil" element={<DaftarMobil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
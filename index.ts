import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "./lib/passport"; // Pastikan passport di-import
import authRoutes from "./routes/authRoutes";
import mobilRoutes from "./routes/mobilRoutes";
import transaksiRoutes from "./routes/transaksiRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy wajib untuk Vercel/hosting HTTPS
app.set("trust proxy", 1); 

// CORS configuration
app.use(cors({ 
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  credentials: true 
}));

// Parser untuk membaca JSON body (harus ada sebelum routes)
app.use(express.json());

// Inisialisasi passport (TIDAK PERLU passport.session() karena kita pakai JWT)
app.use(passport.initialize());

// Routes
app.get("/", (_, res) => res.json({ message: "PPS Rental API is running 🚗" }));
app.use("/api/auth", authRoutes);
app.use("/api/mobil", mobilRoutes);
app.use("/api/transaksi", transaksiRoutes);

// Jalankan app.listen hanya di lokal, Vercel butuh export default app
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
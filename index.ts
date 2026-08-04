import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "./lib/passport";
import authRoutes from "./routes/authRoutes";
import mobilRoutes from "./routes/mobilRoutes";
import transaksiRoutes from "./routes/transaksiRoutes";

dotenv.config();

const app = express();

// 1. FIX CORS: Hardcode domain live dan lokal biar aman di Vercel
const allowedOrigins = [
  "https://rent-pps.vercel.app", // Frontend Vercel lu
  "http://localhost:5173"        // Frontend Lokal lu
];

app.use(cors({ 
  origin: allowedOrigins, 
  credentials: true 
}));

app.use(express.json());

// 2. FIX SESSION: express-session & passport.session() dihapus 
// karena di Vercel (serverless) kita pakai metode stateless (JWT)
app.use(passport.initialize());

app.get("/", (_, res) => res.json({ message: "PPS Rental API is running 🚗" }));
app.use("/api/auth", authRoutes);
app.use("/api/mobil", mobilRoutes);
app.use("/api/transaksi", transaksiRoutes);

// Lokal: jalankan server biasa
// Vercel: export default app (serverless)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./lib/passport";
import authRoutes from "./routes/authRoutes";
import mobilRoutes from "./routes/mobilRoutes";
import transaksiRoutes from "./routes/transaksiRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Wajib ditambahin kalau pakai hosting seperti Render/Railway + HTTPS
app.set("trust proxy", 1); 

// 2. Gunakan Environment Variable untuk URL frontend, fallback ke localhost buat pas lagi ngoding
app.use(cors({ 
  origin: process.env.FRONTEND_URL || "http://localhost:5173", 
  credentials: true 
}));

app.use(express.json());

// 3. Setting cookie agar session tidak diblokir browser saat beda domain
app.use(session({
  secret: process.env.JWT_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    // secure: true wajib kalau URL lu pakai HTTPS, dan sameSite: "none" wajib kalau frontend & backend beda domain
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" 
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (_, res) => res.json({ message: "PPS Rental API is running 🚗" }));
app.use("/api/auth", authRoutes);
app.use("/api/mobil", mobilRoutes);
app.use("/api/transaksi", transaksiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
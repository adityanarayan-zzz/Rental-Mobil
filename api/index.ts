// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import session from "express-session";
// import passport from "../lib/passport";
// import authRoutes from "../routes/authRoutes";
// import mobilRoutes from "../routes/mobilRoutes";
// import transaksiRoutes from "../routes/transaksiRoutes";

// dotenv.config();

// const app = express();

// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// app.use(cors({ origin: FRONTEND_URL, credentials: true }));
// app.use(express.json());
// app.use(session({
//   secret: process.env.JWT_SECRET || "secret",
//   resave: false,
//   saveUninitialized: false,
// }));
// app.use(passport.initialize());
// app.use(passport.session());

// app.get("/", (_, res) => res.json({ message: "PPS Rental API is running 🚗" }));
// app.use("/api/auth", authRoutes);
// app.use("/api/mobil", mobilRoutes);
// app.use("/api/transaksi", transaksiRoutes);

// // PENTING: export default, TANPA app.listen()
// export default app;
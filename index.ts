import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import  authRoutes  from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.get("/", (_, res) => res.json({ message: "PPS Rental API is running" }));
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
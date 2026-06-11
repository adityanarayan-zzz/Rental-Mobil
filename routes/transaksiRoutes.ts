import { Router } from "express";
import { createTransaksi, getAllTransaksi, updateStatusTransaksi, deleteTransaksi } from "../controller/transaksiController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", createTransaksi);
router.get("/", authMiddleware, getAllTransaksi);
router.patch("/:id/status", authMiddleware, updateStatusTransaksi);
router.delete("/:id", authMiddleware, deleteTransaksi);

export default router;
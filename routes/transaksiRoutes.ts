import { Router } from "express";
import {
  createTransaksi,
  getAllTransaksi,
  updateStatusTransaksi,
  deleteTransaksi,
  midtransNotification,
  checkPaymentStatus,
} from "../controller/transaksiController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// PUBLIC
router.post("/", createTransaksi);
router.post("/notification", midtransNotification); // webhook Midtrans
router.get("/status/:order_id", checkPaymentStatus); // polling status pembayaran

// PROTECTED (admin)
router.get("/", authMiddleware, getAllTransaksi);
router.patch("/:id/status", authMiddleware, updateStatusTransaksi);
router.delete("/:id", authMiddleware, deleteTransaksi);

export default router;
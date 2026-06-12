import { Router } from "express";
import {
  getAllMobil,
  getMobilById,
  createMobil,
  updateMobil,
  updateUnit,
  deleteMobil,
  upload,
  uploadMobilImage,
} from "../controller/mobilController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// PUBLIC
router.get("/", getAllMobil);
router.get("/:id", getMobilById);
router.get("/ping", (_req, res) => res.json({ ok: true }));

// PROTECTED
router.post("/upload", authMiddleware, upload.single("image"), uploadMobilImage);
router.post("/", authMiddleware, createMobil);
router.put("/:id", authMiddleware, updateMobil);
router.patch("/:id/unit", authMiddleware, updateUnit);
router.delete("/:id", authMiddleware, deleteMobil);

export default router;
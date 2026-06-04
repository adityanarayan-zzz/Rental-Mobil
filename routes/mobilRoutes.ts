import { Router } from "express";
import {
  getAllMobil,
  getMobilById,
  createMobil,
  updateMobil,
  updateUnit,
  deleteMobil,
} from "../controller/mobilController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();


router.get("/", getAllMobil);
router.get("/:id", getMobilById);


router.post("/", authMiddleware, createMobil);
router.put("/:id", authMiddleware, updateMobil);
router.patch("/:id/unit", authMiddleware, updateUnit);
router.delete("/:id", authMiddleware, deleteMobil);

export default router;
import { Router } from "express";
import { login, register, getMe } from "../controller/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me  (butuh token)
router.get("/me", authMiddleware, getMe);

export default router;
import { Router } from "express";
import { login, register, getMe } from "../controller/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import passport from "../lib/passport";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}?error=google_failed` }),
  (req, res) => {
    const user = req.user as any;

    const token = jwt.sign({ id_user: user.id_user }, JWT_SECRET, { expiresIn: "7d" });

    res.redirect(`${FRONTEND_URL}?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id_user: user.id_user,
      username: user.username,
      email: user.email,
    }))}`);
  }
);

export default router;
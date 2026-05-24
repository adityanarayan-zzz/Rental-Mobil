import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email, NoWA } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ message: "Username, email, dan password wajib diisi" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    const hashed = await bcrypt.hash(password as string, 10);

    const user = await prisma.user.create({
      data: { username, password: hashed, email, NoWA },
    });

    const token = jwt.sign({ id_user: user.id_user }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "Registrasi berhasil",
      token,
      user: {
        id_user: user.id_user,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const valid = await bcrypt.compare(password as string, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = jwt.sign({ id_user: user.id_user }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login berhasil",
      token,
      user: {
        id_user: user.id_user,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET ME
export const getMe = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id_user: number };

    const user = await prisma.user.findUnique({
      where: { id_user: decoded.id_user },
      select: { id_user: true, username: true, email: true, NoWA: true },
    });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    return res.json({ user });
  } catch {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};
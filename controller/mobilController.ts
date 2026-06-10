import { Request, Response } from "express";
import multer from "multer";
import prisma from "../lib/prisma";
import { uploadImage } from "../lib/supabaseStorage";

export const upload = multer({ storage: multer.memoryStorage() });

// UPLOAD IMAGE
export const uploadMobilImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File tidak ditemukan" });
    }
    const url = await uploadImage(req.file);
    return res.json({ url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Gagal upload gambar" });
  }
};

// GET ALL
export const getAllMobil = async (_req: Request, res: Response) => {
  try {
    const mobils = await prisma.mobil.findMany({
      orderBy: { id_mobil: "asc" },
    });
    return res.json({ mobils });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET BY ID
export const getMobilById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const mobil = await prisma.mobil.findUnique({ where: { id_mobil: id } });
    if (!mobil) return res.status(404).json({ message: "Mobil tidak ditemukan" });
    return res.json({ mobil });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// CREATE
export const createMobil = async (req: Request, res: Response) => {
  try {
    const { nama, harga, totalUnit, gambar } = req.body;

    if (!nama || !harga || !totalUnit) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const mobil = await prisma.mobil.create({
      data: {
        nama,
        harga: parseInt(harga),
        totalUnit: parseInt(totalUnit),
        unitTersedia: parseInt(totalUnit),
        gambar: gambar || null,
        tersedia: true,
      },
    });

    return res.status(201).json({ message: "Mobil berhasil ditambahkan", mobil });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
export const updateMobil = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { nama, harga, totalUnit, gambar, tersedia } = req.body;

    const existing = await prisma.mobil.findUnique({ where: { id_mobil: id } });
    if (!existing) return res.status(404).json({ message: "Mobil tidak ditemukan" });

    const unitDiff = totalUnit ? parseInt(totalUnit) - existing.totalUnit : 0;
    const newUnitTersedia = Math.max(0, existing.unitTersedia + unitDiff);

    const mobil = await prisma.mobil.update({
      where: { id_mobil: id },
      data: {
        nama: nama ?? existing.nama,
        harga: harga ? parseInt(harga) : existing.harga,
        totalUnit: totalUnit ? parseInt(totalUnit) : existing.totalUnit,
        unitTersedia: newUnitTersedia,
        gambar: gambar !== undefined ? gambar : existing.gambar,
        tersedia: tersedia !== undefined ? tersedia : existing.tersedia,
      },
    });

    return res.json({ message: "Mobil berhasil diupdate", mobil });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE UNIT ONLY
export const updateUnit = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);
    const { delta } = req.body;

    const existing = await prisma.mobil.findUnique({ where: { id_mobil: id } });
    if (!existing) return res.status(404).json({ message: "Mobil tidak ditemukan" });

    const newTotal = Math.max(0, existing.totalUnit + parseInt(delta));
    const newTersedia = Math.max(0, Math.min(existing.unitTersedia, newTotal));

    const mobil = await prisma.mobil.update({
      where: { id_mobil: id },
      data: {
        totalUnit: newTotal,
        unitTersedia: newTersedia,
        tersedia: newTersedia > 0,
      },
    });

    return res.json({ message: "Unit berhasil diupdate", mobil });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE
export const deleteMobil = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string);

    const existing = await prisma.mobil.findUnique({ where: { id_mobil: id } });
    if (!existing) return res.status(404).json({ message: "Mobil tidak ditemukan" });

    await prisma.mobil.delete({ where: { id_mobil: id } });

    return res.json({ message: "Mobil berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
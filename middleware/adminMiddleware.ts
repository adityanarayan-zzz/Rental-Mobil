// import { Response, NextFunction } from "express";
// import prisma from "../lib/prisma";
// import { AuthRequest } from "./authMiddleware";

// export async function adminMiddleware(
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     if (!req.id_user) {
//       return res.status(401).json({
//         message: "Unauthorized",
//       });
//     }

//     const user = await prisma.user.findUnique({
//       where: {
//         id_user: req.id_user,
//       },
//     });

//     if (!user) {
//       return res.status(401).json({
//         message: "User tidak ditemukan",
//       });
//     }

//     if (!user.email.includes("@admin")) {
//       return res.status(403).json({
//         message: "Akses ditolak",
//       });
//     }

//     next();
//   } catch {
//     return res.status(500).json({
//       message: "Server error",
//     });
//   }
// }
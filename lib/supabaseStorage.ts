import * as dotenv from "dotenv";

dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function uploadImage(
  file: Express.Multer.File
): Promise<string> {
  const fileName = `${Date.now()}-${file.originalname.replace(/\s/g, "_")}`;

  const { error } = await supabase.storage
    .from("mobil-images")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from("mobil-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  const fileName = url.split("/").pop();
  if (!fileName) return;

  await supabase.storage
    .from("mobil-images")
    .remove([fileName]);
}
import { put } from "@vercel/blob";
import sharp from "sharp";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export class ImageError extends Error {}

// Vercel functions cannot keep files on local disk.
// Blob is used when BLOB_READ_WRITE_TOKEN is set; otherwise the photo is stored in Postgres.
export async function storeProductImage(file: File) {
  if (!ALLOWED.has(file.type)) {
    throw new ImageError("Use a JPG, PNG, WEBP, or GIF photo.");
  }
  if (file.size <= 0) throw new ImageError("That photo is empty.");
  if (file.size > MAX_BYTES) throw new ImageError("Please use a photo under 4 MB.");

  let jpeg: Buffer;
  try {
    jpeg = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 82 })
      .toBuffer();
  } catch {
    throw new ImageError("Could not read that photo. Try another image.");
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`products/${Date.now()}.jpg`, jpeg, {
      access: "public",
      contentType: "image/jpeg",
      addRandomSuffix: true,
    });
    return blob.url;
  }

  return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

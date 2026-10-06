import "dotenv/config";
import { readFile } from "fs/promises";
import { createOrder } from "../lib/orders";
import { storeProductImage } from "../lib/images";
import { passwordsMatch, signSession, verifySession } from "../lib/auth";
import { prisma } from "../lib/prisma";

async function main() {
  const product = await prisma.product.findFirst({
    where: { stock: { gte: 1 }, available: true },
    orderBy: { title: "asc" },
  });
  if (!product) throw new Error("No product to order");
  const before = product.stock;

  const order = await createOrder(
    {
      customerName: "Smoke Test",
      phone: "01711000000",
      address: "12 Test Road, Dhanmondi",
      area: "Dhaka",
      note: "smoke",
    },
    { [product.id]: 1 },
  );

  if (order.status !== "NEW") throw new Error(`Expected NEW, got ${order.status}`);
  const updated = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
  if (updated.stock !== before - 1) throw new Error("Stock was not decremented");

  await prisma.order.update({ where: { id: order.id }, data: { status: "PROCESSING" } });
  const processing = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
  if (processing.status !== "PROCESSING") throw new Error("Status update failed");

  await prisma.order.delete({ where: { id: order.id } });
  await prisma.product.update({ where: { id: product.id }, data: { stock: before } });

  const bytes = await readFile("public/products/owl-pearl-bracelet.jpg");
  const file = new File([bytes], "owl.jpg", { type: "image/jpeg" });
  const url = await storeProductImage(file);
  if (!url.startsWith("data:image/jpeg;base64,")) {
    throw new Error("Expected a data URL fallback");
  }
  if (url.length < 1000) throw new Error("Image data URL looks empty");

  process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "picktrinkets";
  if (!(await passwordsMatch("picktrinkets", process.env.ADMIN_PASSWORD))) {
    throw new Error("Password match failed");
  }
  if (await passwordsMatch("nope", process.env.ADMIN_PASSWORD)) {
    throw new Error("Wrong password matched");
  }
  const token = await signSession();
  if (!(await verifySession(token))) throw new Error("Session did not verify");
  if (await verifySession(`${token}x`)) throw new Error("Bad session verified");

  console.log("Smoke checks passed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

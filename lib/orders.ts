import { randomBytes } from "crypto";
import type { CartMap } from "./cart";
import { isBdPhone } from "./phone";
import { prisma } from "./prisma";

export type OrderInput = {
  customerName: string;
  phone: string;
  address: string;
  area: string;
  note: string;
};

export class OrderError extends Error {}

function makeCode() {
  return `PT-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export function validateCustomer(input: OrderInput) {
  const customerName = input.customerName.trim();
  const phone = input.phone.trim();
  const address = input.address.trim();
  const area = input.area.trim();
  const note = input.note.trim();

  if (customerName.length < 2) return "Please write your name.";
  if (!isBdPhone(phone)) return "Use a Bangladeshi mobile number, like 01XXXXXXXXX.";
  if (address.length < 8) return "Add a delivery address we can find.";
  if (area.length < 2) return "Add your area or city.";
  if (note.length > 500) return "Keep the note under 500 characters.";

  return null;
}

export async function createOrder(input: OrderInput, cart: CartMap) {
  const error = validateCustomer(input);
  if (error) throw new OrderError(error);

  const ids = Object.keys(cart);
  if (ids.length === 0) throw new OrderError("Your bag is empty.");

  return prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({ where: { id: { in: ids } } });
    const byId = new Map(products.map((product) => [product.id, product]));

    const lines = ids.map((id) => {
      const product = byId.get(id);
      const quantity = cart[id] ?? 0;
      if (!product || !product.available) {
        throw new OrderError("A piece in your bag is no longer available.");
      }
      if (quantity > product.stock) {
        throw new OrderError(`${product.title} does not have enough stock. Update your bag.`);
      }
      return { product, quantity };
    });

    for (const line of lines) {
      const updated = await tx.product.updateMany({
        where: {
          id: line.product.id,
          available: true,
          stock: { gte: line.quantity },
        },
        data: { stock: { decrement: line.quantity } },
      });
      if (updated.count !== 1) {
        throw new OrderError(`${line.product.title} just sold out. Please update your bag.`);
      }
    }

    let code = makeCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await tx.order.findUnique({ where: { code } });
      if (!existing) break;
      code = makeCode();
    }

    const subtotal = lines.reduce(
      (sum, line) => sum + Number(line.product.price) * line.quantity,
      0,
    );
    const settings = await tx.shopSetting.findUnique({ where: { id: "shop" } });
    const deliveryCharge = Math.max(0, Number(settings?.deliveryCharge ?? 0));
    const total = subtotal + deliveryCharge;

    const order = await tx.order.create({
      data: {
        code,
        customerName: input.customerName.trim(),
        phone: input.phone.trim(),
        address: input.address.trim(),
        area: input.area.trim(),
        note: input.note.trim() || null,
        status: "NEW",
        total,
        deliveryCharge,
        items: {
          create: lines.map((line) => ({
            productId: line.product.id,
            productName: line.product.title,
            unitPrice: line.product.price,
            quantity: line.quantity,
          })),
        },
        events: {
          create: { toStatus: "NEW" },
        },
      },
    });

    return order;
  });
}

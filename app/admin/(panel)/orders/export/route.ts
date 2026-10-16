import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySession } from "@/lib/auth";
import { formatWhen } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const filters = ["NEW", "PROCESSING", "DONE"] as const;

function cell(value: string | number) {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export async function GET(request: Request) {
  const jar = await cookies();
  const ok = await verifySession(jar.get(ADMIN_COOKIE)?.value);
  if (!ok) return new Response("Sign in required.", { status: 401 });

  const url = new URL(request.url);
  const status = filters.find((item) => item === url.searchParams.get("status"));
  const q = url.searchParams.get("q")?.trim() ?? "";

  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { code: { contains: q, mode: "insensitive" } },
              { customerName: { contains: q, mode: "insensitive" } },
              { phone: { contains: q } },
              { area: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "code",
    "created_at",
    "status",
    "customer_name",
    "phone",
    "address",
    "area",
    "note",
    "pieces",
    "delivery_charge",
    "total",
    "items",
  ];
  const lines = orders.map((order) => {
    const delivery = Number(order.deliveryCharge);
    const pieces = Number(order.total) - delivery;
    return [
      order.code,
      formatWhen(order.createdAt),
      order.status,
      order.customerName,
      order.phone,
      order.address,
      order.area,
      order.note ?? "",
      pieces,
      delivery,
      Number(order.total),
      order.items.map((item) => `${item.productName} x ${item.quantity}`).join("; "),
    ]
      .map(cell)
      .join(",");
  });

  const csv = [header.join(","), ...lines].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=pick-trinkets-orders.csv",
    },
  });
}

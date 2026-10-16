import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderTracker } from "@/components/order-tracker";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Params = { code: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { code } = await params;
  return { title: `Order ${code}` };
}

export default async function OrderConfirmationPage({ params }: { params: Promise<Params> }) {
  const { code } = await params;
  const order = await prisma.order.findUnique({
    where: { code },
    include: { items: true, events: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) notFound();

  return (
    <div>
      <p className="mx-auto mb-2 max-w-xl text-sm font-bold text-pink-deep">Order received</p>
      <OrderTracker order={order} />
      <p className="mx-auto mt-4 max-w-xl text-sm text-muted">
        Save <strong>{order.code}</strong> and look it up any time on the track page. We will call{" "}
        {order.phone} before the courier goes out.
      </p>
    </div>
  );
}
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 1 || query.length > 80) {
    return Response.json({ products: [] });
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: [{ stock: "desc" }, { title: "asc" }],
    take: 6,
    select: {
      id: true,
      title: true,
      slug: true,
      price: true,
      imageUrl: true,
      available: true,
      stock: true,
    },
  });

  return Response.json({
    products: products.map((product) => ({
      ...product,
      price: Number(product.price),
    })),
  });
}

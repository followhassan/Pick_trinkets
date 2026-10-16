import "dotenv/config";
import { prisma } from "../lib/prisma";

const categories = [
  { name: "Phone charms", slug: "phone-charms" },
  { name: "Bag charms", slug: "bag-charms" },
  { name: "Bracelets", slug: "bracelets" },
];

const products: Array<{
  category: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  featured: boolean;
}> = [
  {
    category: "phone-charms",
    title: "Enamel Flower Phone Charm",
    slug: "enamel-flower-phone-charm",
    description:
      "Phone charm with two floral enamel drops on a silver chain. Light enough for daily use — clip it to your case or bag. Handmade in Dhaka.",
    price: 180,
    stock: 8,
    image: "enamel-flower-phone-charm.jpg",
    featured: true,
  },
  {
    category: "phone-charms",
    title: "Pink Heart Phone Charm",
    slug: "pink-heart-phone-charm",
    description:
      "Pink beads, a tiny heart, and a phone-strap loop. A small everyday charm. Message us if you want the same shape in another colour.",
    price: 160,
    stock: 10,
    image: "pink-heart-phone-charm.jpg",
    featured: false,
  },
  {
    category: "bag-charms",
    title: "Pink Headphone Bag Charm",
    slug: "pink-headphone-charm",
    description:
      "Bag charm with a glossy pink headphone drop, organza bow, angel wing, star, and pearl. Clip it to a tote, pouch, or phone strap.",
    price: 280,
    stock: 6,
    image: "pink-headphone-charm.jpg",
    featured: true,
  },
  {
    category: "bag-charms",
    title: "Blossom Cord Charm",
    slug: "blossom-cord-charm",
    description:
      "Navy cord with pale blossom beads and tiny leaves. Wear it as a bag charm or a soft wrap. Handmade, so each one sits a little differently.",
    price: 190,
    stock: 9,
    image: "blossom-cord-charm.jpg",
    featured: false,
  },
  {
    category: "bag-charms",
    title: "Berry Pearl Bag Charm",
    slug: "berry-pearl-bag-charm",
    description:
      "Cream pearls and red berry beads on a silver chain — a little cherry mood for zippers and straps.",
    price: 220,
    stock: 7,
    image: "berry-pearl-bag-charm.jpg",
    featured: true,
  },
  {
    category: "bracelets",
    title: "Pearl Bow Bracelet",
    slug: "pearl-bow-bracelet",
    description:
      "Silver chain, cream pearls, crystal spacers, and a small bow charm. A delicate everyday bracelet. Custom length on request.",
    price: 220,
    stock: 8,
    image: "pearl-bow-bracelet.jpg",
    featured: true,
  },
  {
    category: "bracelets",
    title: "Bamboo Jade Bracelet",
    slug: "bamboo-bracelet",
    description:
      "Lime bamboo tubes, jade-green rounds, silver spacers, and a hanging bell drop. Extension chain included.",
    price: 250,
    stock: 5,
    image: "bamboo-bracelet.jpg",
    featured: true,
  },
  {
    category: "bracelets",
    title: "Bamboo Jade Gold Bracelet",
    slug: "bamboo-jade-gold-bracelet",
    description:
      "Lime and milk-white bamboo tubes on gold findings, with a clover flower and a dangling bamboo bead. Handmade in Dhaka.",
    price: 260,
    stock: 6,
    image: "bamboo-jade-gold-bracelet.jpg",
    featured: false,
  },
  {
    category: "bracelets",
    title: "Bamboo Bell Bracelet",
    slug: "bamboo-bell-bracelet",
    description:
      "Olive bamboo beads, gold spacers, jade rounds, and three tiny bells. A soft jingle on the wrist.",
    price: 270,
    stock: 5,
    image: "bamboo-bell-bracelet.jpg",
    featured: false,
  },
  {
    category: "bracelets",
    title: "Flower Bead Bracelet Set",
    slug: "flower-bead-bracelets",
    description:
      "Stretch stack of daisy-bead bracelets in pink, mint, black, and butter yellow. Wear one or pile them on. Price is for the set.",
    price: 320,
    stock: 4,
    image: "flower-bead-bracelets.jpg",
    featured: true,
  },
  {
    category: "bracelets",
    title: "Cherry Pearl Bracelet",
    slug: "cherry-pearl-bracelet",
    description:
      "Pearls with tiny red berries and a silver clasp. Sits pretty alone or next to a thinner chain.",
    price: 240,
    stock: 6,
    image: "cherry-pearl-bracelet.jpg",
    featured: true,
  },
  {
    category: "bracelets",
    title: "Owl Pearl Bracelet",
    slug: "owl-pearl-bracelet",
    description: "Dainty pearls and a tiny owl charm. A small good-luck piece to wear or gift.",
    price: 210,
    stock: 7,
    image: "owl-pearl-bracelet.jpg",
    featured: false,
  },
  {
    category: "bracelets",
    title: "Cream Pearl Cuff",
    slug: "cream-pearl-cuff",
    description:
      "Open cuff of cream pearls on gold-tone wire. Sold out for now — message us on Instagram if you want the next batch.",
    price: 380,
    stock: 0,
    image: "cream-pearl-cuff.jpg",
    featured: false,
  },
  {
    category: "bracelets",
    title: "Fruit Pearl Bracelet Trio",
    slug: "fruit-pearl-bracelets",
    description:
      "Three stretch bracelets: leaf-and-pearl, black-and-gold, and amber with a fruit charm. Price is for the trio.",
    price: 350,
    stock: 5,
    image: "fruit-pearl-bracelets.jpg",
    featured: false,
  },
  {
    category: "bracelets",
    title: "Green Blossom Bracelet",
    slug: "green-blossom-bracelet",
    description: "White blossoms and green beads on a silver chain. Fresh, simple, handmade.",
    price: 200,
    stock: 8,
    image: "green-blossom-bracelet.jpg",
    featured: false,
  },
];

const bestsellerSlugs = new Set([
  "pink-headphone-charm",
  "berry-pearl-bag-charm",
  "pearl-bow-bracelet",
  "flower-bead-bracelets",
  "cherry-pearl-bracelet",
]);

async function main() {
  for (const [index, category] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: { ...category, sortOrder: index },
    });
  }

  const saved = await prisma.category.findMany();
  const bySlug = new Map(saved.map((category) => [category.slug, category.id]));

  for (const product of products) {
    const categoryId = bySlug.get(product.category);
    if (!categoryId) throw new Error(`Missing category ${product.category}`);

    const existing = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (existing) continue;

    await prisma.product.create({
      data: {
        slug: product.slug,
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock,
        featured: product.featured,
        bestseller: bestsellerSlugs.has(product.slug),
        available: true,
        imageUrl: `/products/${product.image}`,
        categoryId,
        ...(product.slug === "berry-pearl-bag-charm"
          ? {
              images: {
                create: { url: "/products/berry-pearl-detail.jpg", sortOrder: 0 },
              },
            }
          : {}),
      },
    });
  }

  await prisma.shopSetting.upsert({
    where: { id: "shop" },
    update: {},
    create: {
      id: "shop",
      announcement: "Handmade in Dhaka · Cash on delivery · No online payment",
      heroTitle: "Cute handmade accessories",
      heroSubtitle:
        "Phone charms, bag charms, and bracelets from Dhaka. Place an order here — we confirm by phone, then send it cash on delivery.",
      contactPhone: "",
      deliveryCharge: 0,
      lowStockThreshold: 3,
    },
  });

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
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

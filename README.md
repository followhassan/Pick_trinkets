# Pick Trinkets

Cute handmade accessories from Dhaka: phone charms, bag charms, and bracelets. Customers place an order on the site. The shop confirms it and sends it **cash on delivery**. There is no online payment.

- Instagram: [@picktrinkets](https://www.instagram.com/picktrinkets/)
- Facebook: [facebook.com/picktrinkets](https://www.facebook.com/picktrinkets/)
- Email: [picktrinkets@gmail.com](mailto:picktrinkets@gmail.com)

The old PHP + MySQL shop is in git history. This repository is a Next.js app that deploys to Vercel.

## Pages

- `/` home
- `/shop` catalog, category filters, and search
- `/product/[slug]` product detail
- `/cart` bag and place-order form
- `/order/[code]` confirmation (status starts as **new**)
- `/admin` password-protected staff area: products and orders

## Environment variables

Copy `.env.example` to `.env`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Postgres connection used by the app. On Neon, use the **pooled** URL. |
| `DIRECT_URL` | For migrations | Non-pooled Postgres URL used by Prisma migrate. If you only have one URL, set this to the same value as `DATABASE_URL`. |
| `ADMIN_PASSWORD` | Yes | Single password for `/admin`. There is no username. |
| `NEXT_PUBLIC_SITE_URL` | Optional | Public URL, used for link previews. Example: `https://your-app.vercel.app` |
| `BLOB_READ_WRITE_TOKEN` | Optional | When set, new product photos upload to [Vercel Blob](https://vercel.com/docs/vercel-blob). When empty, photos are resized and stored in Postgres as data URLs, which also works on Vercel. |

## Local setup

You need Node.js 20.19+ and a Postgres database. The easiest database is a free [Neon](https://neon.tech) project: create it, copy the connection strings into `.env`, and skip installing Postgres on your computer.

```bash
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

`db:setup` applies the committed migration and loads the sample catalog. Open http://localhost:3000

Staff login: http://localhost:3000/admin/login — the password is whatever you set as `ADMIN_PASSWORD`.

Other database commands:

```bash
npm run db:deploy   # apply migrations
npm run db:seed     # add sample products (skips ones that already exist)
npm run db:push     # push schema without a migration file
npm run build       # production build
```

Sample photos live in `public/products`. Re-running the seed does not overwrite products you have edited.

## Deploy on Vercel

1. Push this repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the repo. Framework preset: Next.js.
3. Create a Postgres database and copy its URLs into the project’s environment variables:
   - **Neon (free):** create a project at [neon.tech](https://neon.tech). Set `DATABASE_URL` to the pooled connection string and `DIRECT_URL` to the direct connection string. Include `sslmode=require` if it is not already in the URL.
   - **Vercel Postgres:** open the project **Storage** tab, create a Postgres database (Neon is the usual marketplace option), and connect it. Put the pooled URL in `DATABASE_URL` and the direct URL in `DIRECT_URL`.
4. Add `ADMIN_PASSWORD`. Add `NEXT_PUBLIC_SITE_URL` once you know the Vercel URL (you can redeploy after the first deploy).
5. Optional: create a Blob store under **Storage**, connect it, and Vercel will set `BLOB_READ_WRITE_TOKEN`. New product photos then go to Blob instead of the database.
6. Deploy. The build runs `prisma migrate deploy`, which creates the tables.
7. Seed the catalog once from your computer, using the production URLs:

```bash
DATABASE_URL="postgresql://..." DIRECT_URL="postgresql://..." npm run db:seed
```

8. Open the deployment URL. The shop is public. Staff tools are at `/admin/login`.

Orders are saved with status **new**. Change them to **processing** or **done** from the orders list. Delivery charges stay off the site and are confirmed with the customer, the same way the shop already works.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Prisma 7 with Postgres (`pg` driver). Product uploads use Vercel Blob when `BLOB_READ_WRITE_TOKEN` is present.

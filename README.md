# Pick Trinkets

Cute handmade accessories from **Dhaka, Bangladesh** — phone charms, bag charms, and bracelets, with custom orders. This repo is a small PHP + MySQL shop for [Pick Trinkets](https://www.facebook.com/picktrinkets/).

Pastel catalog layout (collection pills, product cards, `Tk …` prices, sold-out badges) is inspired by common kawaii boutique patterns. Brand, photos, and copy are original to Pick Trinkets.

## Stack

- HTML + CSS
- PHP 8.1+ (no framework)
- MySQL / MariaDB

## Local run

```bash
cp config.example.php config.php
mysql -u root -p < sql/schema.sql
mysql -u root -p < sql/seed.sql
php -S 127.0.0.1:43123 -t public public/router.php
```

Then open [http://127.0.0.1:43123](http://127.0.0.1:43123).

Edit `config.php` if your MySQL user, password, or host is not `root` / empty / `127.0.0.1`.

## Default staff login

- Username: `admin`
- Password: `picktrinkets`

**Change this before production.** Update the `staff` row (bcrypt hash) or add a new user and delete `admin`.

Staff tools live at `/admin/login`:

- Product CRUD with image upload
- Order status (pending → confirmed → shipped → delivered)
- Cancelling an order restocks inventory

## Features

- Home hero with brand mark + Facebook cover
- Shop grid (2 columns on mobile, 4 on desktop) with categories and search
- Product pages, session shopping bag, cash-on-delivery checkout
- Orders stored in `orders` + `order_items`

## Project layout

```
config.example.php   → copy to config.php (gitignored)
sql/schema.sql
sql/seed.sql
includes/            bootstrap, db, cart, auth, views
public/              web root
public/router.php    PHP built-in server front controller
public/assets/img/   logo.jpg, circular logo.png, cover, favicons
public/assets/products/  seed catalog photos
```

## Brand

- Email: picktrinkets@gmail.com
- Facebook: https://www.facebook.com/picktrinkets/
- Instagram: [@picktrinkets](https://www.instagram.com/picktrinkets/)
- Tagline: Cute handmade accessories

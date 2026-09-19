# Pick Trinkets

Cute handmade accessories from **Dhaka, Bangladesh**: phone charms, bag charms, and bracelets. Custom orders. Prices in **BDT**. Default payment **cash on delivery**.

PHP + MySQL shop (HTML/CSS storefront, a little JavaScript for the bag stepper and mobile menu). Catalog layout is a simple product grid — original Pick Trinkets branding from the Facebook page, not another shop’s assets.

- Facebook: [facebook.com/picktrinkets](https://www.facebook.com/picktrinkets/)
- Instagram: [@picktrinkets](https://www.instagram.com/picktrinkets/)
- Email: [picktrinkets@gmail.com](mailto:picktrinkets@gmail.com)

## Features

- Home + catalog from MySQL (phone charms / bag charms / bracelets, search, sold-out badges)
- Product detail pages with stock-aware add-to-bag
- Session cart (add / update quantity / remove)
- Checkout (name, phone, address, city, notes) → `orders` + `order_items`, **COD**
- Custom-order page (DM on Facebook / email)
- Admin login, product CRUD (image upload), order list + status

## Layout

```
config.example.php          copy to config.php
includes/                   bootstrap, db, cart, auth, header/footer
public/                     web root
  index.php shop.php product.php cart.php checkout.php
  success.php about.php custom.php
  admin/
  assets/img/logo.png       circular brand mark
  assets/img/cover.jpg      Facebook-style cover
  assets/products/          catalog photos
sql/schema.sql
sql/seed.sql
```

## Requirements

- PHP 8.1+ with `pdo_mysql`, `mbstring`, `gd`
- MySQL 5.7+ or MariaDB 10.4+
- Apache (XAMPP / Laragon) **or** PHP’s built-in server

## 1. Configure

```bash
cp config.example.php config.php
```

Default local MySQL: host `127.0.0.1`, database/user/password `picktrinkets`.

If the shop lives in a subdirectory (XAMPP), set `app.base_url` to that public path, e.g. `/picktrinkets/public`. Leave it empty when document root is `public/`.

## 2. Import MySQL

```bash
mysql -u root -p < sql/schema.sql
mysql -u root -p < sql/seed.sql
```

Create an app user if you are not using `root`:

```sql
CREATE USER IF NOT EXISTS 'picktrinkets'@'127.0.0.1' IDENTIFIED BY 'picktrinkets';
GRANT ALL PRIVILEGES ON picktrinkets.* TO 'picktrinkets'@'127.0.0.1';
FLUSH PRIVILEGES;
```

Some MariaDB installs use a socket for `root` with no password:

```bash
sudo mysql < sql/schema.sql
sudo mysql < sql/seed.sql
```

**Staff login:** `admin` / `picktrinkets` — change this on a real host.

## 3. Run locally

### PHP built-in server

```bash
php -S 127.0.0.1:43123 -t public public/router.php
```

Open http://127.0.0.1:43123/

### GitHub

Target repo: [github.com/followhassan/Pick_trinkets](https://github.com/followhassan/Pick_trinkets)

```bash
git remote add github https://github.com/followhassan/Pick_trinkets.git
git push -u github main
```

If GitHub already has a different (empty) history:

```bash
git push --force-with-lease github main
```

### XAMPP

1. Copy the project into `htdocs/picktrinkets`.
2. Import `sql/schema.sql` and `sql/seed.sql` in phpMyAdmin.
3. Copy `config.example.php` → `config.php` (XAMPP `root` is often empty password).
4. Set `app.base_url` to `/picktrinkets/public` if you did not add a vhost.
5. Visit `http://localhost/picktrinkets/public/`.

### Laragon

Point the site document root at `public/`, import the SQL files, copy `config.php`.

## Brand assets

| File | Use |
| --- | --- |
| `public/assets/img/logo.jpg` / `logo.png` | Facebook profile mark (hot pink *PICK TRINKETS*) |
| `public/assets/img/cover.jpg` | Cover collage on the home page |
| `public/assets/products/*.jpg` | Seed catalog (charms + bracelets) |

## Notes

- The bag is a PHP session until checkout.
- Delivery charge is confirmed on the COD call / Facebook message.
- Custom work is quoted over Facebook DM or email, matching how the shop already takes orders.

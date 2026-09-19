<?php
require_once dirname(__DIR__, 2) . '/includes/bootstrap.php';
require_admin();

$id = (int) ($_GET['id'] ?? 0);
$product = $id ? fetch_product($id) : null;
$categories = fetch_categories();
$errors = [];

$name = $product['name'] ?? '';
$slug = $product['slug'] ?? '';
$description = $product['description'] ?? '';
$price = $product['price'] ?? '0';
$stock = $product['stock'] ?? '0';
$categoryId = $product['category_id'] ?? ($categories[0]['id'] ?? 1);
$featured = (int) ($product['is_featured'] ?? 0);
$image = $product['image'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verify();
    $name = trim((string) ($_POST['name'] ?? ''));
    $slug = slugify((string) ($_POST['slug'] ?? $name));
    $description = trim((string) ($_POST['description'] ?? ''));
    $price = (float) ($_POST['price'] ?? 0);
    $stock = max(0, (int) ($_POST['stock'] ?? 0));
    $categoryId = (int) ($_POST['category_id'] ?? 0);
    $featured = isset($_POST['is_featured']) ? 1 : 0;

    if ($name === '') {
        $errors[] = 'Name is required.';
    }
    if ($slug === '') {
        $errors[] = 'Slug is required.';
    }
    if ($price < 0) {
        $errors[] = 'Price cannot be negative.';
    }

    $dup = db()->prepare('SELECT id FROM products WHERE slug = ? AND id != ?');
    $dup->execute([$slug, $id]);
    if ($dup->fetch()) {
        $errors[] = 'That slug is already used.';
    }

    if (!empty($_FILES['image']['name']) && is_uploaded_file($_FILES['image']['tmp_name'])) {
        $ext = strtolower(pathinfo((string) $_FILES['image']['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'], true)) {
            $errors[] = 'Images must be jpg, png, webp, or gif.';
        } else {
            $filename = $slug . '-' . bin2hex(random_bytes(3)) . '.' . $ext;
            $dest = PT_ROOT . '/public/assets/products/' . $filename;
            if (!move_uploaded_file($_FILES['image']['tmp_name'], $dest)) {
                $errors[] = 'Could not save the image.';
            } else {
                $image = $filename;
            }
        }
    }

    if ($image === '' && !$errors) {
        $errors[] = 'Please upload a product image.';
    }

    if (!$errors) {
        if ($id > 0 && $product) {
            db()->prepare(
                'UPDATE products SET category_id=?, name=?, slug=?, description=?, price=?, stock=?, image=?, is_featured=? WHERE id=?'
            )->execute([$categoryId, $name, $slug, $description, $price, $stock, $image, $featured, $id]);
            flash_set('ok', 'Product saved.');
        } else {
            db()->prepare(
                'INSERT INTO products (category_id, name, slug, description, price, stock, image, is_featured)
                 VALUES (?,?,?,?,?,?,?,?)'
            )->execute([$categoryId, $name, $slug, $description, $price, $stock, $image, $featured]);
            flash_set('ok', 'Product added.');
        }
        redirect('admin/products.php');
    }
}

$pageTitle = ($product ? 'Edit' : 'New') . ' product — Studio';
require PT_ROOT . '/includes/header.php';
?>

<section class="page-head">
    <p class="eyebrow">Studio</p>
    <h1><?= $product ? 'Edit product' : 'New product' ?></h1>
    <p class="admin-nav">
        <a href="<?= e(url('admin/products.php')) ?>">All products</a>
        <a href="<?= e(url('admin/index.php')) ?>">Dashboard</a>
    </p>
</section>

<?php if ($errors): ?>
    <div class="flash flash--error"><ul><?php foreach ($errors as $err): ?><li><?= e($err) ?></li><?php endforeach; ?></ul></div>
<?php endif; ?>

<form method="post" enctype="multipart/form-data" class="checkout-form admin-form">
    <?= csrf_field() ?>
    <label>Name
        <input name="name" required value="<?= e($name) ?>">
    </label>
    <label>Slug
        <input name="slug" value="<?= e($slug) ?>" placeholder="auto from name if blank">
    </label>
    <label>Category
        <select name="category_id">
            <?php foreach ($categories as $c): ?>
                <option value="<?= (int) $c['id'] ?>" <?= (int) $c['id'] === (int) $categoryId ? 'selected' : '' ?>><?= e($c['name']) ?></option>
            <?php endforeach; ?>
        </select>
    </label>
    <label>Description
        <textarea name="description" rows="5"><?= e($description) ?></textarea>
    </label>
    <div class="form-row">
        <label>Price (BDT)
            <input type="number" name="price" min="0" step="0.01" value="<?= e((string) $price) ?>" required>
        </label>
        <label>Stock
            <input type="number" name="stock" min="0" value="<?= e((string) $stock) ?>" required>
        </label>
    </div>
    <label class="check">
        <input type="checkbox" name="is_featured" value="1" <?= $featured ? 'checked' : '' ?>> Featured on the home page
    </label>
    <?php if ($image): ?>
        <p>Current image: <img class="thumb thumb--lg" src="<?= e(product_image_url($image)) ?>" alt=""></p>
    <?php endif; ?>
    <label>Product image
        <input type="file" name="image" accept="image/*" <?= $image ? '' : 'required' ?>>
    </label>
    <button class="btn btn--primary" type="submit">Save</button>
</form>

<?php require PT_ROOT . '/includes/footer.php'; ?>

<?php
require_once dirname(__DIR__) . '/includes/bootstrap.php';

$slug = trim((string) ($_GET['slug'] ?? ''));
$product = $slug !== '' ? fetch_product_by_slug($slug) : null;
if (!$product) {
    http_response_code(404);
    $pageTitle = 'Not found — Pick Trinkets';
    require PT_ROOT . '/includes/header.php';
    echo '<div class="empty"><h1>That trinket wandered off</h1><p>It may have been renamed or removed.</p><a class="btn btn--primary" href="' . e(url('shop.php')) . '">Back to shop</a></div>';
    require PT_ROOT . '/includes/footer.php';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verify();
    $qty = max(1, (int) ($_POST['qty'] ?? 1));
    $err = cart_add((int) $product['id'], $qty);
    if ($err !== '') {
        flash_set('error', $err);
        redirect('product.php?slug=' . $product['slug']);
    }
    flash_set('ok', $product['name'] . ' is in your bag.');
    redirect('cart.php');
}

$related = db()->prepare(
    'SELECT p.*, c.slug AS category_slug FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.category_id = ? AND p.id != ?
     ORDER BY p.stock > 0 DESC, p.id DESC LIMIT 4'
);
$related->execute([(int) $product['category_id'], (int) $product['id']]);
$relatedRows = $related->fetchAll();

$sold = !in_stock($product);
$pageTitle = $product['name'] . ' — Pick Trinkets';
$pageDescription = $product['description'] ?? $product['name'];

require PT_ROOT . '/includes/header.php';
?>

<article class="pdp">
    <div class="pdp__media<?= $sold ? ' is-soldout' : '' ?>">
        <img src="<?= e(product_image_url($product['image'])) ?>" alt="<?= e($product['name']) ?>" width="800" height="800">
        <?php if ($sold): ?><span class="badge badge--sold">Sold out</span><?php endif; ?>
    </div>
    <div class="pdp__info">
        <a class="crumb" href="<?= e(url('shop.php?category=' . $product['category_slug'])) ?>"><?= e($product['category_name']) ?></a>
        <h1><?= e($product['name']) ?></h1>
        <p class="price price--lg"><?= e(money((float) $product['price'])) ?></p>
        <p class="pdp__desc"><?= nl2br(e($product['description'] ?? '')) ?></p>
        <?php if ($sold): ?>
            <p class="stock-note">Sold out — we restock in small batches. Custom versions are still open: DM to place your order.</p>
            <a class="btn btn--ghost" href="<?= e($config['app']['facebook']) ?>" target="_blank" rel="noopener">DM on Facebook</a>
        <?php else: ?>
            <p class="stock-note"><?= (int) $product['stock'] ?> in stock · Cash on delivery</p>
            <form method="post" class="add-form">
                <?= csrf_field() ?>
                <label>
                    <span class="sr-only">Quantity</span>
                    <button type="button" class="stepper" data-step="-1" aria-label="Decrease">−</button>
                    <input type="number" name="qty" min="1" max="<?= (int) $product['stock'] ?>" value="1">
                    <button type="button" class="stepper" data-step="1" aria-label="Increase">+</button>
                </label>
                <button class="btn btn--primary" type="submit">Add to bag</button>
            </form>
        <?php endif; ?>
    </div>
</article>

<?php if ($relatedRows): ?>
<section class="section">
    <div class="section-head"><h2>More in <?= e($product['category_name']) ?></h2></div>
    <div class="product-grid">
        <?php foreach ($relatedRows as $p) { render_product_card($p); } ?>
    </div>
</section>
<?php endif; ?>

<?php require PT_ROOT . '/includes/footer.php'; ?>

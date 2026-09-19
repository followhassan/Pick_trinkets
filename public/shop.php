<?php
require_once dirname(__DIR__) . '/includes/bootstrap.php';

$categorySlug = trim((string) ($_GET['category'] ?? ''));
$q = trim((string) ($_GET['q'] ?? ''));
$categories = fetch_categories();

$sql = 'SELECT p.*, c.name AS category_name, c.slug AS category_slug
        FROM products p JOIN categories c ON c.id = p.category_id WHERE 1=1';
$params = [];

$currentCategory = null;
if ($categorySlug !== '') {
    $sql .= ' AND c.slug = ?';
    $params[] = $categorySlug;
    foreach ($categories as $c) {
        if ($c['slug'] === $categorySlug) {
            $currentCategory = $c;
            break;
        }
    }
}
if ($q !== '') {
    $sql .= ' AND (p.name LIKE ? OR p.description LIKE ?)';
    $like = '%' . $q . '%';
    $params[] = $like;
    $params[] = $like;
}
$sql .= ' ORDER BY (p.stock > 0) DESC, p.name ASC';

$stmt = db()->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll();

$pageTitle = ($currentCategory['name'] ?? 'Shop') . ' — Pick Trinkets';
$pageDescription = 'Handmade phone charms, bag charms, and bracelets from Pick Trinkets, Dhaka. Prices in BDT.';

require PT_ROOT . '/includes/header.php';
?>

<section class="page-head">
    <p class="eyebrow">Catalog</p>
    <h1><?= e($currentCategory['name'] ?? 'All pieces') ?></h1>
    <p>Cute handmade accessories from Dhaka. Sold-out pieces stay listed so you can watch Facebook for a restock. Custom mixes are made to order.</p>
</section>

<form class="shop-tools" method="get" action="<?= e(url('shop.php')) ?>">
    <div class="chips" role="navigation" aria-label="Categories">
        <a class="chip<?= $categorySlug === '' ? ' is-on' : '' ?>" href="<?= e(url('shop.php')) ?>">All</a>
        <?php foreach ($categories as $c): ?>
            <a class="chip<?= $categorySlug === $c['slug'] ? ' is-on' : '' ?>"
               href="<?= e(url('shop.php?category=' . $c['slug'])) ?>"><?= e($c['name']) ?></a>
        <?php endforeach; ?>
    </div>
    <label class="search">
        <span class="sr-only">Search</span>
        <input type="search" name="q" value="<?= e($q) ?>" placeholder="Search charms, bracelets…">
        <?php if ($categorySlug !== ''): ?>
            <input type="hidden" name="category" value="<?= e($categorySlug) ?>">
        <?php endif; ?>
        <button class="btn btn--tiny" type="submit">Search</button>
    </label>
</form>

<?php if (!$products): ?>
    <div class="empty">
        <h2>Nothing matched that search</h2>
        <p>Try another word, or browse the full catalog.</p>
        <a class="btn btn--primary" href="<?= e(url('shop.php')) ?>">Clear filters</a>
    </div>
<?php else: ?>
    <p class="result-count"><?= count($products) ?> piece<?= count($products) === 1 ? '' : 's' ?></p>
    <div class="product-grid">
        <?php foreach ($products as $p) { render_product_card($p); } ?>
    </div>
<?php endif; ?>

<?php require PT_ROOT . '/includes/footer.php'; ?>

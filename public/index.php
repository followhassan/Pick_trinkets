<?php
require_once dirname(__DIR__) . '/includes/bootstrap.php';

$pageTitle = 'Pick Trinkets — cute handmade accessories, Dhaka';
$pageDescription = 'Phone charms, bag charms, and bracelets handmade in Dhaka, Bangladesh. Custom orders. Cash on delivery.';

$featured = db()->query(
    'SELECT p.*, c.slug AS category_slug FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.is_featured = 1
     ORDER BY p.id DESC LIMIT 8'
)->fetchAll();

$latest = db()->query(
    'SELECT p.*, c.slug AS category_slug FROM products p
     JOIN categories c ON c.id = p.category_id
     ORDER BY p.id DESC LIMIT 8'
)->fetchAll();

require PT_ROOT . '/includes/header.php';
?>

<section class="cover-wrap">
    <img class="cover-img" src="<?= e(asset('img/cover.jpg')) ?>" alt="Handmade Pick Trinkets bracelets, charms, and jewelry">
</section>

<section class="hero">
    <div class="hero__copy">
        <p class="eyebrow"><?= e($location) ?> · handmade</p>
        <h1><?= e($tagline) ?>.</h1>
        <p class="lede">Phone charms, bag charms, and bracelets — made in small batches in Dhaka. Custom pieces too: tell us a colour, a charm, a name. We confirm on Facebook, then send cash on delivery.</p>
        <div class="hero__actions">
            <a class="btn btn--primary" href="<?= e(url('shop.php')) ?>">Shop the table</a>
            <a class="btn btn--ghost" href="<?= e(url('custom.php')) ?>">Custom order</a>
        </div>
    </div>
    <div class="hero__panel">
        <img class="hero-logo" src="<?= e(asset('img/logo.png')) ?>" alt="Pick Trinkets">
        <p class="hero-handle">@picktrinkets</p>
        <p class="muted">Facebook · Instagram · <?= e($email) ?></p>
    </div>
</section>

<section class="band">
    <div class="band__item"><strong>Phone charms</strong> Clip-on pieces for cases and straps</div>
    <div class="band__item"><strong>Bag charms</strong> Bows, pearls, headphones, berries</div>
    <div class="band__item"><strong>Bracelets</strong> Pearls, bamboo, blossoms, stacks</div>
</section>

<section class="section">
    <div class="section-head">
        <h2>Shop by type</h2>
        <a href="<?= e(url('shop.php')) ?>">See everything</a>
    </div>
    <div class="category-row category-row--3">
        <?php
        $mood = [
            'phone-charms' => ['Phone charms', 'enamel-flower-phone-charm.jpg'],
            'bag-charms' => ['Bag charms', 'pink-headphone-charm.jpg'],
            'bracelets' => ['Bracelets', 'bamboo-bracelet.jpg'],
        ];
        foreach ($mood as $slug => [$label, $thumb]):
        ?>
            <a class="cat-tile" href="<?= e(url('shop.php?category=' . $slug)) ?>">
                <img src="<?= e(asset('products/' . $thumb)) ?>" alt="">
                <span><?= e($label) ?></span>
            </a>
        <?php endforeach; ?>
    </div>
</section>

<section class="custom-banner">
    <p class="eyebrow">Made for you</p>
    <h2>Custom phone charm made for a customer. DM to place your orders.</h2>
    <p>Pick colours, charms, and length. We reply on Facebook and pack from Dhaka.</p>
    <a class="btn btn--primary" href="<?= e($fb) ?>" target="_blank" rel="noopener">Message on Facebook</a>
</section>

<section class="section">
    <div class="section-head">
        <h2>On the table</h2>
        <p>Ready-to-ship pieces. Prices in BDT.</p>
    </div>
    <div class="product-grid">
        <?php foreach ($featured as $p) { render_product_card($p); } ?>
    </div>
</section>

<section class="section section--last">
    <div class="section-head">
        <h2>More handmade</h2>
        <a href="<?= e(url('shop.php')) ?>">Full catalog</a>
    </div>
    <div class="product-grid">
        <?php foreach ($latest as $p) { render_product_card($p); } ?>
    </div>
</section>

<?php require PT_ROOT . '/includes/footer.php'; ?>

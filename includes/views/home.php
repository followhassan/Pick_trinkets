<section class="wrap">
  <div class="hero">
    <img class="cover" src="<?= e(asset('img/cover.jpg')) ?>" alt="Pick Trinkets handmade jewellery lookbook">
    <div class="hero-card">
      <p class="kicker">Dhaka, Bangladesh</p>
      <h1>Pick Trinkets</h1>
      <p>Cute handmade accessories — phone charms, bag charms, and bracelets. Custom orders available. DM to place your orders.</p>
      <a class="btn" href="<?= e(url('/shop')) ?>">Shop the catalog</a>
    </div>
  </div>
</section>

<section class="wrap section">
  <div class="section-head">
    <div>
      <p class="kicker">Browse</p>
      <h2>Little treasures</h2>
    </div>
    <a class="btn ghost" href="<?= e(url('/shop')) ?>">View all</a>
  </div>
  <div class="pills">
    <?php foreach ($categories as $c): ?>
      <a class="pill" href="<?= e(url('/shop?category=' . urlencode($c['slug']))) ?>"><?= e($c['name']) ?></a>
    <?php endforeach; ?>
  </div>
  <?php include APP_ROOT . '/includes/views/partials/product-grid.php'; ?>
</section>

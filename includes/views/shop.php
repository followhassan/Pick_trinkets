<section class="wrap section">
  <div class="section-head">
    <div>
      <p class="kicker">Catalog</p>
      <h2><?= $cat ? e(ucfirst(str_replace('-', ' ', $cat))) : 'All pieces' ?></h2>
      <p class="muted">Handmade in Dhaka. Prices in Bangladeshi Taka. Cash on delivery.</p>
    </div>
  </div>

  <form class="search-row" method="get" action="<?= e(url('/shop')) ?>">
    <?php if ($cat): ?>
      <input type="hidden" name="category" value="<?= e($cat) ?>">
    <?php endif; ?>
    <input type="search" name="q" value="<?= e($q) ?>" placeholder="Search charms, bows, bamboo…">
    <button class="btn" type="submit">Search</button>
  </form>

  <div class="pills">
    <a class="pill <?= $cat === '' ? 'is-on' : '' ?>" href="<?= e(url('/shop' . ($q !== '' ? '?q=' . urlencode($q) : ''))) ?>">All</a>
    <?php foreach ($categories as $c): ?>
      <?php
        $href = '/shop?category=' . urlencode($c['slug']);
        if ($q !== '') {
            $href .= '&q=' . urlencode($q);
        }
      ?>
      <a class="pill <?= $cat === $c['slug'] ? 'is-on' : '' ?>" href="<?= e(url($href)) ?>"><?= e($c['name']) ?></a>
    <?php endforeach; ?>
  </div>

  <?php include APP_ROOT . '/includes/views/partials/product-grid.php'; ?>
</section>

<div class="grid">
  <?php foreach (($products ?? $featured ?? []) as $p): ?>
    <article class="card">
      <a href="<?= e(url('/product/' . $p['slug'])) ?>">
        <div class="card-media">
          <img src="<?= e(product_image_url($p['image'])) ?>" alt="<?= e($p['name']) ?>">
          <?php if ((int) $p['stock'] < 1): ?>
            <span class="badge">Sold out</span>
          <?php endif; ?>
        </div>
        <div class="card-body">
          <div class="card-cat"><?= e($p['category_name']) ?></div>
          <h3><?= e($p['name']) ?></h3>
          <div class="price"><?= e(money($p['price_bdt'])) ?></div>
        </div>
      </a>
    </article>
  <?php endforeach; ?>
</div>
<?php if (empty($products ?? $featured ?? [])): ?>
  <p class="empty">Nothing here yet — try another category or search.</p>
<?php endif; ?>

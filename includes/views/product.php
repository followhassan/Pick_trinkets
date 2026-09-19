<section class="wrap product">
  <div class="product-photo">
    <img src="<?= e(product_image_url($product['image'])) ?>" alt="<?= e($product['name']) ?>">
  </div>
  <div>
    <p class="kicker"><a href="<?= e(url('/shop?category=' . urlencode($product['category_slug']))) ?>"><?= e($product['category_name']) ?></a></p>
    <h1><?= e($product['name']) ?></h1>
    <p class="price"><?= e(money($product['price_bdt'])) ?></p>
    <?php if ((int) $product['stock'] < 1): ?>
      <p><span class="badge" style="position:static;display:inline-block">Sold out</span></p>
      <p class="muted">This one flew. Message Pick Trinkets on Facebook or Instagram for a custom remake.</p>
    <?php else: ?>
      <p class="muted"><?= (int) $product['stock'] ?> in stock · Cash on delivery in Bangladesh</p>
      <form method="post" action="<?= e(url('/bag/add')) ?>">
        <?= csrf_field() ?>
        <input type="hidden" name="product_id" value="<?= (int) $product['id'] ?>">
        <div class="qty-row">
          <label for="qty">Qty</label>
          <input id="qty" type="number" name="qty" min="1" max="<?= (int) $product['stock'] ?>" value="1">
          <button class="btn" type="submit">Add to bag</button>
        </div>
      </form>
    <?php endif; ?>
    <p><?= nl2br(e($product['description'])) ?></p>
    <p class="muted">Custom orders available. Sample note from our page: “Custom phone charm made for a customer. DM to place your orders.”</p>
  </div>
</section>

<?php if (!empty($related)): ?>
<section class="wrap section">
  <div class="section-head">
    <h2>More like this</h2>
  </div>
  <?php $products = $related; include APP_ROOT . '/includes/views/partials/product-grid.php'; ?>
</section>
<?php endif; ?>

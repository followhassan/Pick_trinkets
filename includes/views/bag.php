<section class="wrap section">
  <div class="section-head">
    <h2>Shopping bag</h2>
    <a class="btn ghost" href="<?= e(url('/shop')) ?>">Keep browsing</a>
  </div>

  <?php if (!$items): ?>
    <p class="empty">Your bag is empty. Add a charm or bracelet from the shop.</p>
  <?php else: ?>
    <form method="post" action="<?= e(url('/bag/update')) ?>">
      <?= csrf_field() ?>
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th>Piece</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($items as $item): ?>
            <tr>
              <td><img class="thumb" src="<?= e(product_image_url($item['image'])) ?>" alt=""></td>
              <td>
                <a href="<?= e(url('/product/' . $item['slug'])) ?>"><strong><?= e($item['name']) ?></strong></a>
                <div class="muted"><?= e($item['category_name']) ?></div>
              </td>
              <td><?= e(money($item['price_bdt'])) ?></td>
              <td>
                <input type="number" name="qty[<?= (int) $item['id'] ?>]" min="0" max="<?= (int) $item['stock'] ?>" value="<?= (int) $item['qty'] ?>" style="width:4.5rem">
              </td>
              <td><?= e(money($item['line_total'])) ?></td>
              <td>
                <button class="btn ghost" form="remove-<?= (int) $item['id'] ?>" type="submit">Remove</button>
              </td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
      <p style="margin-top:1rem"><strong>Subtotal <?= e(money($total)) ?></strong></p>
      <button class="btn ghost" type="submit">Update bag</button>
      <a class="btn" href="<?= e(url('/checkout')) ?>">Checkout · cash on delivery</a>
    </form>
    <?php foreach ($items as $item): ?>
      <form id="remove-<?= (int) $item['id'] ?>" method="post" action="<?= e(url('/bag/remove')) ?>">
        <?= csrf_field() ?>
        <input type="hidden" name="product_id" value="<?= (int) $item['id'] ?>">
      </form>
    <?php endforeach; ?>
  <?php endif; ?>
</section>

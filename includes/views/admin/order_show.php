<section class="wrap section">
  <p><a href="<?= e(url('/admin/orders')) ?>">← All orders</a></p>
  <h2>Order #<?= (int) $order['id'] ?></h2>
  <p><strong><?= e($order['customer_name']) ?></strong> · <?= e($order['phone']) ?></p>
  <p><?= nl2br(e($order['address'])) ?><br><?= e($order['city']) ?></p>
  <?php if ($order['notes']): ?>
    <p class="muted">Notes: <?= nl2br(e($order['notes'])) ?></p>
  <?php endif; ?>
  <p>Status: <strong><?= e($order['status']) ?></strong> · Total <?= e(money($order['total_bdt'])) ?></p>

  <form class="form" method="post" action="<?= e(url('/admin/orders/' . (int) $order['id'] . '/status')) ?>" style="max-width:420px">
    <?= csrf_field() ?>
    <label for="status">Update status</label>
    <select id="status" name="status">
      <?php foreach (['pending','confirmed','shipped','delivered','cancelled'] as $st): ?>
        <option value="<?= e($st) ?>" <?= $order['status'] === $st ? 'selected' : '' ?>><?= e($st) ?></option>
      <?php endforeach; ?>
    </select>
    <p class="muted">Cancelling restocks inventory. Reopening a cancelled order deducts stock again if available.</p>
    <button class="btn" type="submit">Save status</button>
  </form>

  <h3>Items</h3>
  <table class="table">
    <thead>
      <tr><th>Piece</th><th>Qty</th><th>Unit</th><th>Line</th></tr>
    </thead>
    <tbody>
      <?php foreach ($items as $item): ?>
        <tr>
          <td><?= e($item['product_name']) ?></td>
          <td><?= (int) $item['qty'] ?></td>
          <td><?= e(money($item['unit_price_bdt'])) ?></td>
          <td><?= e(money($item['unit_price_bdt'] * $item['qty'])) ?></td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</section>

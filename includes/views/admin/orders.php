<section class="wrap section">
  <div class="section-head">
    <h2>Orders</h2>
  </div>
  <?php if (!$orders): ?>
    <p class="empty">No orders yet.</p>
  <?php else: ?>
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Customer</th>
          <th>Phone</th>
          <th>City</th>
          <th>Total</th>
          <th>Status</th>
          <th>Placed</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($orders as $o): ?>
          <tr>
            <td><a href="<?= e(url('/admin/orders/' . (int) $o['id'])) ?>">#<?= (int) $o['id'] ?></a></td>
            <td><?= e($o['customer_name']) ?></td>
            <td><?= e($o['phone']) ?></td>
            <td><?= e($o['city']) ?></td>
            <td><?= e(money($o['total_bdt'])) ?></td>
            <td><?= e($o['status']) ?></td>
            <td><?= e($o['created_at']) ?></td>
          </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  <?php endif; ?>
</section>

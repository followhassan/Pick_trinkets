<section class="wrap section">
  <div class="section-head">
    <div>
      <p class="kicker">Cash on delivery</p>
      <h2>Checkout</h2>
      <p class="muted">We confirm by phone, then deliver in Bangladesh. Pay in cash when it arrives.</p>
    </div>
  </div>
  <div class="checkout-grid">
    <form class="form" method="post" action="<?= e(url('/checkout')) ?>">
      <?= csrf_field() ?>
      <label for="customer_name">Full name</label>
      <input id="customer_name" name="customer_name" required value="<?= e(old('customer_name')) ?>">
      <label for="phone">Phone</label>
      <input id="phone" name="phone" required value="<?= e(old('phone')) ?>" placeholder="01XXXXXXXXX">
      <label for="address">Address</label>
      <textarea id="address" name="address" rows="4" required><?= e(old('address')) ?></textarea>
      <label for="city">City</label>
      <input id="city" name="city" required value="<?= e(old('city', 'Dhaka')) ?>">
      <label for="notes">Notes (optional)</label>
      <textarea id="notes" name="notes" rows="3" placeholder="Colour tweaks, landmark, preferred time…"><?= e(old('notes')) ?></textarea>
      <button class="btn" type="submit">Place COD order</button>
    </form>
    <div>
      <h3>Your bag</h3>
      <table class="table">
        <?php foreach ($items as $item): ?>
          <tr>
            <td><?= e($item['name']) ?> × <?= (int) $item['qty'] ?></td>
            <td><?= e(money($item['line_total'])) ?></td>
          </tr>
        <?php endforeach; ?>
        <tr>
          <th>Total</th>
          <th><?= e(money($total)) ?></th>
        </tr>
      </table>
    </div>
  </div>
</section>

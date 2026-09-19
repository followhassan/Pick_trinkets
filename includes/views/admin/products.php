<section class="wrap section">
  <div class="section-head">
    <h2>Products</h2>
    <a class="btn" href="<?= e(url('/admin/products/new')) ?>">Add product</a>
  </div>
  <table class="table">
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Category</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Live</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($products as $p): ?>
        <tr>
          <td><img class="thumb" src="<?= e(product_image_url($p['image'])) ?>" alt=""></td>
          <td><?= e($p['name']) ?></td>
          <td><?= e($p['category_name']) ?></td>
          <td><?= e(money($p['price_bdt'])) ?></td>
          <td><?= (int) $p['stock'] ?></td>
          <td><?= $p['is_active'] ? 'Yes' : 'Hidden' ?></td>
          <td>
            <a class="btn ghost" href="<?= e(url('/admin/products/' . (int) $p['id'] . '/edit')) ?>">Edit</a>
            <form method="post" action="<?= e(url('/admin/products/delete')) ?>" style="display:inline" onsubmit="return confirm('Delete or hide this product?')">
              <?= csrf_field() ?>
              <input type="hidden" name="id" value="<?= (int) $p['id'] ?>">
              <button class="btn danger" type="submit">Delete</button>
            </form>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</section>

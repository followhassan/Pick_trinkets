<section class="wrap section">
  <h2><?= $product ? 'Edit product' : 'New product' ?></h2>
  <form class="form" method="post" action="<?= e(url('/admin/products/save')) ?>" enctype="multipart/form-data">
    <?= csrf_field() ?>
    <input type="hidden" name="id" value="<?= (int) ($product['id'] ?? 0) ?>">
    <label for="name">Name</label>
    <input id="name" name="name" required value="<?= e($product['name'] ?? '') ?>">
    <label for="slug">Slug (optional)</label>
    <input id="slug" name="slug" value="<?= e($product['slug'] ?? '') ?>">
    <label for="category_id">Category</label>
    <select id="category_id" name="category_id" required>
      <?php foreach ($categories as $c): ?>
        <option value="<?= (int) $c['id'] ?>" <?= isset($product['category_id']) && (int) $product['category_id'] === (int) $c['id'] ? 'selected' : '' ?>>
          <?= e($c['name']) ?>
        </option>
      <?php endforeach; ?>
    </select>
    <label for="description">Description</label>
    <textarea id="description" name="description" rows="6" required><?= e($product['description'] ?? '') ?></textarea>
    <label for="price_bdt">Price (BDT)</label>
    <input id="price_bdt" name="price_bdt" type="number" min="0" step="0.01" required value="<?= e($product['price_bdt'] ?? '0') ?>">
    <label for="stock">Stock</label>
    <input id="stock" name="stock" type="number" min="0" required value="<?= e($product['stock'] ?? '0') ?>">
    <label for="image">Photo <?= $product ? '(leave empty to keep current)' : '' ?></label>
    <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" <?= $product ? '' : 'required' ?>>
    <?php if (!empty($product['image'])): ?>
      <img class="thumb" src="<?= e(product_image_url($product['image'])) ?>" alt="">
    <?php endif; ?>
    <label><input type="checkbox" name="is_active" value="1" <?= !isset($product['is_active']) || $product['is_active'] ? 'checked' : '' ?>> Visible in shop</label>
    <button class="btn" type="submit">Save</button>
  </form>
</section>

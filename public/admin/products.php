<?php
require_once dirname(__DIR__, 2) . '/includes/bootstrap.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verify();
    $id = (int) ($_POST['id'] ?? 0);
    if (($_POST['action'] ?? '') === 'delete' && $id > 0) {
        db()->prepare('DELETE FROM products WHERE id = ?')->execute([$id]);
        flash_set('ok', 'Product removed.');
    }
    redirect('admin/products.php');
}

$rows = db()->query(
    'SELECT p.*, c.name AS category_name FROM products p
     JOIN categories c ON c.id = p.category_id
     ORDER BY p.name'
)->fetchAll();

$pageTitle = 'Products — Studio';
require PT_ROOT . '/includes/header.php';
?>

<section class="page-head">
    <p class="eyebrow">Studio</p>
    <h1>Products</h1>
    <p class="admin-nav">
        <a href="<?= e(url('admin/index.php')) ?>">Dashboard</a>
        <a href="<?= e(url('admin/product-form.php')) ?>">New product</a>
        <a href="<?= e(url('admin/orders.php')) ?>">Orders</a>
    </p>
</section>

<div class="table-wrap">
    <table class="data">
        <thead>
        <tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr>
        </thead>
        <tbody>
        <?php foreach ($rows as $p): ?>
            <tr>
                <td><img class="thumb" src="<?= e(product_image_url($p['image'])) ?>" alt=""></td>
                <td>
                    <a href="<?= e(url('product.php?slug=' . $p['slug'])) ?>"><?= e($p['name']) ?></a>
                    <div class="muted"><?= e($p['slug']) ?></div>
                </td>
                <td><?= e($p['category_name']) ?></td>
                <td><?= e(money((float) $p['price'])) ?></td>
                <td><?= (int) $p['stock'] <= 0 ? '<span class="status status--cancelled">sold out</span>' : (int) $p['stock'] ?></td>
                <td class="row-actions">
                    <a href="<?= e(url('admin/product-form.php?id=' . $p['id'])) ?>">Edit</a>
                    <form method="post" onsubmit="return confirm('Delete this product?')">
                        <?= csrf_field() ?>
                        <input type="hidden" name="action" value="delete">
                        <input type="hidden" name="id" value="<?= (int) $p['id'] ?>">
                        <button class="linkish" type="submit">Delete</button>
                    </form>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
</div>

<?php require PT_ROOT . '/includes/footer.php'; ?>

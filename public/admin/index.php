<?php
require_once dirname(__DIR__, 2) . '/includes/bootstrap.php';
$admin = require_admin();

$orders = (int) db()->query('SELECT COUNT(*) FROM orders')->fetchColumn();
$pending = (int) db()->query("SELECT COUNT(*) FROM orders WHERE status = 'pending'")->fetchColumn();
$products = (int) db()->query('SELECT COUNT(*) FROM products')->fetchColumn();
$soldout = (int) db()->query('SELECT COUNT(*) FROM products WHERE stock <= 0')->fetchColumn();

$recent = db()->query(
    'SELECT * FROM orders ORDER BY created_at DESC LIMIT 8'
)->fetchAll();

$pageTitle = 'Studio — Pick Trinkets';
require PT_ROOT . '/includes/header.php';
?>

<section class="page-head">
    <p class="eyebrow">Studio</p>
    <h1>Hello, <?= e($admin['username']) ?></h1>
    <p class="admin-nav">
        <a href="<?= e(url('admin/products.php')) ?>">Products</a>
        <a href="<?= e(url('admin/product-form.php')) ?>">New product</a>
        <a href="<?= e(url('admin/orders.php')) ?>">Orders</a>
        <a href="<?= e(url('admin/logout.php')) ?>">Log out</a>
    </p>
</section>

<div class="stats">
    <div><strong><?= $pending ?></strong><span>Pending orders</span></div>
    <div><strong><?= $orders ?></strong><span>All orders</span></div>
    <div><strong><?= $products ?></strong><span>Products</span></div>
    <div><strong><?= $soldout ?></strong><span>Sold out</span></div>
</div>

<section class="section">
    <div class="section-head"><h2>Latest orders</h2><a href="<?= e(url('admin/orders.php')) ?>">View all</a></div>
    <?php if (!$recent): ?>
        <p class="muted">No orders yet.</p>
    <?php else: ?>
        <div class="table-wrap">
            <table class="data">
                <thead>
                <tr><th>Code</th><th>Customer</th><th>Total</th><th>Status</th><th>When</th></tr>
                </thead>
                <tbody>
                <?php foreach ($recent as $o): ?>
                    <tr>
                        <td><a href="<?= e(url('admin/order.php?id=' . $o['id'])) ?>"><?= e($o['order_code']) ?></a></td>
                        <td><?= e($o['customer_name']) ?></td>
                        <td><?= e(money((float) $o['total'])) ?></td>
                        <td><span class="status status--<?= e($o['status']) ?>"><?= e($o['status']) ?></span></td>
                        <td><?= e($o['created_at']) ?></td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</section>

<?php require PT_ROOT . '/includes/footer.php'; ?>

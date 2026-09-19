<?php
require_once dirname(__DIR__, 2) . '/includes/bootstrap.php';
require_admin();

$filter = (string) ($_GET['status'] ?? '');
$sql = 'SELECT * FROM orders';
$params = [];
if (in_array($filter, ['pending', 'confirmed', 'shipped', 'cancelled'], true)) {
    $sql .= ' WHERE status = ?';
    $params[] = $filter;
}
$sql .= ' ORDER BY created_at DESC';
$stmt = db()->prepare($sql);
$stmt->execute($params);
$orders = $stmt->fetchAll();

$pageTitle = 'Orders — Studio';
require PT_ROOT . '/includes/header.php';
?>

<section class="page-head">
    <p class="eyebrow">Studio</p>
    <h1>Orders</h1>
    <p class="admin-nav">
        <a href="<?= e(url('admin/index.php')) ?>">Dashboard</a>
        <a href="<?= e(url('admin/products.php')) ?>">Products</a>
    </p>
</section>

<div class="chips">
    <a class="chip<?= $filter === '' ? ' is-on' : '' ?>" href="<?= e(url('admin/orders.php')) ?>">All</a>
    <?php foreach (['pending', 'confirmed', 'shipped', 'cancelled'] as $st): ?>
        <a class="chip<?= $filter === $st ? ' is-on' : '' ?>" href="<?= e(url('admin/orders.php?status=' . $st)) ?>"><?= e($st) ?></a>
    <?php endforeach; ?>
</div>

<?php if (!$orders): ?>
    <div class="empty"><h2>No orders in this list</h2></div>
<?php else: ?>
    <div class="table-wrap">
        <table class="data">
            <thead>
            <tr><th>Code</th><th>Customer</th><th>City</th><th>Total</th><th>Pay</th><th>Status</th><th>When</th></tr>
            </thead>
            <tbody>
            <?php foreach ($orders as $o): ?>
                <tr>
                    <td><a href="<?= e(url('admin/order.php?id=' . $o['id'])) ?>"><?= e($o['order_code']) ?></a></td>
                    <td><?= e($o['customer_name']) ?><div class="muted"><?= e($o['phone']) ?></div></td>
                    <td><?= e($o['city']) ?></td>
                    <td><?= e(money((float) $o['total'])) ?></td>
                    <td><?= e($o['payment_method']) ?></td>
                    <td><span class="status status--<?= e($o['status']) ?>"><?= e($o['status']) ?></span></td>
                    <td><?= e($o['created_at']) ?></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
<?php endif; ?>

<?php require PT_ROOT . '/includes/footer.php'; ?>

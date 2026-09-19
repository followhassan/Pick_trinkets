<?php
require_once dirname(__DIR__, 2) . '/includes/bootstrap.php';
require_admin();

$id = (int) ($_GET['id'] ?? 0);
$stmt = db()->prepare('SELECT * FROM orders WHERE id = ?');
$stmt->execute([$id]);
$order = $stmt->fetch();
if (!$order) {
    http_response_code(404);
    $pageTitle = 'Order missing';
    require PT_ROOT . '/includes/header.php';
    echo '<div class="empty"><h1>Order not found</h1></div>';
    require PT_ROOT . '/includes/footer.php';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verify();
    $status = (string) ($_POST['status'] ?? '');
    $allowed = ['pending', 'confirmed', 'shipped', 'cancelled'];
    if (in_array($status, $allowed, true) && $status !== $order['status']) {
        $pdo = db();
        $pdo->beginTransaction();
        try {
            if ($status === 'cancelled' && $order['status'] !== 'cancelled') {
                $items = $pdo->prepare('SELECT product_id, quantity FROM order_items WHERE order_id = ?');
                $items->execute([$id]);
                $restock = $pdo->prepare('UPDATE products SET stock = stock + ? WHERE id = ?');
                foreach ($items as $item) {
                    if ($item['product_id']) {
                        $restock->execute([(int) $item['quantity'], (int) $item['product_id']]);
                    }
                }
            }
            $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?')->execute([$status, $id]);
            $pdo->commit();
            flash_set('ok', 'Order marked ' . $status . '.');
        } catch (Throwable $e) {
            $pdo->rollBack();
            flash_set('error', 'Could not update that order.');
        }
    }
    redirect('admin/order.php?id=' . $id);
}

$items = db()->prepare('SELECT * FROM order_items WHERE order_id = ?');
$items->execute([$id]);
$rows = $items->fetchAll();

$pageTitle = $order['order_code'] . ' — Studio';
require PT_ROOT . '/includes/header.php';
?>

<section class="page-head">
    <p class="eyebrow">Order</p>
    <h1><?= e($order['order_code']) ?></h1>
    <p class="admin-nav"><a href="<?= e(url('admin/orders.php')) ?>">All orders</a></p>
</section>

<div class="checkout-layout">
    <div>
        <h2>Customer</h2>
        <p><?= e($order['customer_name']) ?><br><?= e($order['phone']) ?></p>
        <p><?= nl2br(e($order['address'])) ?><br><?= e($order['city']) ?></p>
        <?php if ($order['notes']): ?>
            <p><strong>Notes:</strong> <?= nl2br(e($order['notes'])) ?></p>
        <?php endif; ?>
        <p>Payment: <?= e($order['payment_method']) ?> · Placed <?= e($order['created_at']) ?></p>
        <form method="post" class="status-form">
            <?= csrf_field() ?>
            <label>Status
                <select name="status">
                    <?php foreach (['pending', 'confirmed', 'shipped', 'cancelled'] as $st): ?>
                        <option value="<?= e($st) ?>" <?= $order['status'] === $st ? 'selected' : '' ?>><?= e($st) ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <button class="btn btn--primary" type="submit">Save status</button>
        </form>
    </div>
    <aside class="cart-summary">
        <h2>Items</h2>
        <ul class="mini-lines">
            <?php foreach ($rows as $row): ?>
                <li>
                    <span><?= e($row['product_name']) ?> × <?= (int) $row['quantity'] ?></span>
                    <span><?= e(money((float) $row['unit_price'] * (int) $row['quantity'])) ?></span>
                </li>
            <?php endforeach; ?>
        </ul>
        <p class="summary-row"><span>Total</span><strong><?= e(money((float) $order['total'])) ?></strong></p>
    </aside>
</div>

<?php require PT_ROOT . '/includes/footer.php'; ?>

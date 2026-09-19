<?php
require_once dirname(__DIR__) . '/includes/bootstrap.php';

$code = strtoupper(trim((string) ($_GET['code'] ?? '')));
$order = null;
if ($code !== '') {
    $stmt = db()->prepare('SELECT * FROM orders WHERE order_code = ? LIMIT 1');
    $stmt->execute([$code]);
    $order = $stmt->fetch() ?: null;
}

if (!$order) {
    http_response_code(404);
    $pageTitle = 'Order not found — Pick Trinkets';
    require PT_ROOT . '/includes/header.php';
    echo '<div class="empty"><h1>We cannot find that order</h1><a class="btn btn--primary" href="' . e(url()) . '">Home</a></div>';
    require PT_ROOT . '/includes/footer.php';
    exit;
}

$items = db()->prepare('SELECT * FROM order_items WHERE order_id = ?');
$items->execute([(int) $order['id']]);
$rows = $items->fetchAll();

$pageTitle = 'Order ' . $order['order_code'] . ' — Pick Trinkets';
require PT_ROOT . '/includes/header.php';
?>

<section class="success">
    <p class="eyebrow">Thank you</p>
    <h1>Order <?= e($order['order_code']) ?> is in.</h1>
    <p>We will call <strong><?= e($order['phone']) ?></strong> to confirm, then send it COD to <?= e($order['city']) ?>.</p>
    <ul class="mini-lines">
        <?php foreach ($rows as $row): ?>
            <li>
                <span><?= e($row['product_name']) ?> × <?= (int) $row['quantity'] ?></span>
                <span><?= e(money((float) $row['unit_price'] * (int) $row['quantity'])) ?></span>
            </li>
        <?php endforeach; ?>
    </ul>
    <p class="summary-row"><span>Total</span><strong><?= e(money((float) $order['total'])) ?></strong></p>
    <p class="muted">Save this code. Message us on Facebook if anything looks off.</p>
    <div class="hero__actions">
        <a class="btn btn--primary" href="<?= e(url('shop.php')) ?>">Keep browsing</a>
        <a class="btn btn--ghost" href="<?= e($config['app']['facebook']) ?>" target="_blank" rel="noopener">Facebook</a>
    </div>
</section>

<?php require PT_ROOT . '/includes/footer.php'; ?>

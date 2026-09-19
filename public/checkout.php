<?php
require_once dirname(__DIR__) . '/includes/bootstrap.php';

$lines = cart_lines();
if (!$lines) {
    flash_set('error', 'Your bag is empty.');
    redirect('shop.php');
}

$errors = [];
$old = [
    'customer_name' => '',
    'phone' => '',
    'address' => '',
    'city' => '',
    'notes' => '',
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verify();
    foreach ($old as $k => $_) {
        $old[$k] = trim((string) ($_POST[$k] ?? ''));
    }

    if ($old['customer_name'] === '' || mb_strlen($old['customer_name']) < 2) {
        $errors[] = 'Please write your name.';
    }
    if (!bd_phone_ok($old['phone'])) {
        $errors[] = 'Use a Bangladeshi mobile number (01XXXXXXXXX).';
    }
    if (mb_strlen($old['address']) < 8) {
        $errors[] = 'Please add a delivery address we can find.';
    }
    if ($old['city'] === '') {
        $errors[] = 'Please add your city.';
    }

    // Re-check stock
    foreach ($lines as $line) {
        if ($line['qty'] > (int) $line['product']['stock']) {
            $errors[] = $line['product']['name'] . ' does not have enough stock. Update your bag.';
        }
    }

    if (!$errors) {
        $pdo = db();
        $pdo->beginTransaction();
        try {
            $code = order_code();
            $ins = $pdo->prepare(
                'INSERT INTO orders (order_code, customer_name, phone, address, city, notes, payment_method, status, total)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $ins->execute([
                $code,
                $old['customer_name'],
                $old['phone'],
                $old['address'],
                $old['city'],
                $old['notes'] !== '' ? $old['notes'] : null,
                'COD',
                'pending',
                cart_subtotal(),
            ]);
            $orderId = (int) $pdo->lastInsertId();

            $itemStmt = $pdo->prepare(
                'INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity)
                 VALUES (?, ?, ?, ?, ?)'
            );
            $stockStmt = $pdo->prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?');

            foreach ($lines as $line) {
                $p = $line['product'];
                $itemStmt->execute([
                    $orderId,
                    $p['id'],
                    $p['name'],
                    $p['price'],
                    $line['qty'],
                ]);
                $stockStmt->execute([$line['qty'], $p['id'], $line['qty']]);
                if ($stockStmt->rowCount() !== 1) {
                    throw new RuntimeException('stock');
                }
            }

            $pdo->commit();
            cart_clear();
            redirect('success.php?code=' . urlencode($code));
        } catch (Throwable $e) {
            $pdo->rollBack();
            $errors[] = 'We could not place that order (a piece may have just sold out). Please refresh your bag.';
        }
    }
}

$pageTitle = 'Checkout — Pick Trinkets';
require PT_ROOT . '/includes/header.php';
?>

<section class="page-head">
    <p class="eyebrow">Checkout</p>
    <h1>Cash on delivery</h1>
    <p>We will call to confirm, then send your order. No card needed.</p>
</section>

<?php if ($errors): ?>
    <div class="flash flash--error">
        <ul><?php foreach ($errors as $err): ?><li><?= e($err) ?></li><?php endforeach; ?></ul>
    </div>
<?php endif; ?>

<div class="checkout-layout">
    <form method="post" class="checkout-form" novalidate>
        <?= csrf_field() ?>
        <label>Full name
            <input name="customer_name" required value="<?= e($old['customer_name']) ?>" autocomplete="name">
        </label>
        <label>Phone
            <input name="phone" required value="<?= e($old['phone']) ?>" inputmode="tel" autocomplete="tel" placeholder="01XXXXXXXXX">
        </label>
        <label>Address
            <textarea name="address" required rows="3" placeholder="House, road, area"><?= e($old['address']) ?></textarea>
        </label>
        <label>City
            <input name="city" required value="<?= e($old['city']) ?>" placeholder="Dhaka, Chattogram, Sylhet…">
        </label>
        <label>Notes <span class="muted">(optional)</span>
            <textarea name="notes" rows="2" placeholder="Landmark, preferred call time, colour if you already messaged us"><?= e($old['notes']) ?></textarea>
        </label>
        <p class="pay-pill">Payment: <strong>Cash on delivery</strong></p>
        <button class="btn btn--primary" type="submit">Place COD order</button>
    </form>
    <aside class="cart-summary">
        <h2>Your bag</h2>
        <ul class="mini-lines">
            <?php foreach ($lines as $line): ?>
                <li>
                    <span><?= e($line['product']['name']) ?> × <?= (int) $line['qty'] ?></span>
                    <span><?= e(money($line['line_total'])) ?></span>
                </li>
            <?php endforeach; ?>
        </ul>
        <p class="summary-row"><span>Total</span><strong><?= e(money(cart_subtotal())) ?></strong></p>
        <p class="muted">Delivery charge is confirmed on the call — typical for a small Dhaka shop.</p>
        <a href="<?= e(url('cart.php')) ?>">Edit bag</a>
    </aside>
</div>

<?php require PT_ROOT . '/includes/footer.php'; ?>

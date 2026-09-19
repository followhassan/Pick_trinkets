<?php
require_once dirname(__DIR__) . '/includes/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verify();
    $action = (string) ($_POST['action'] ?? '');
    if ($action === 'update') {
        foreach (($_POST['qty'] ?? []) as $id => $qty) {
            cart_update((int) $id, (int) $qty);
        }
        flash_set('ok', 'Bag updated.');
    } elseif ($action === 'remove') {
        cart_remove((int) ($_POST['product_id'] ?? 0));
        flash_set('ok', 'Removed from your bag.');
    }
    redirect('cart.php');
}

$lines = cart_lines();
$pageTitle = 'Your bag — Pick Trinkets';
require PT_ROOT . '/includes/header.php';
?>

<section class="page-head">
    <p class="eyebrow">Cart</p>
    <h1>Your bag</h1>
</section>

<?php if (!$lines): ?>
    <div class="empty">
        <h2>Nothing in here yet</h2>
        <p>Phone charms, bag charms, bracelets — pick a little something.</p>
        <a class="btn btn--primary" href="<?= e(url('shop.php')) ?>">Browse the shop</a>
    </div>
<?php else: ?>
    <div class="cart-layout">
        <div class="cart-lines">
            <form id="update-bag" method="post">
                <?= csrf_field() ?>
                <input type="hidden" name="action" value="update">
            </form>
            <?php foreach ($lines as $line):
                $p = $line['product'];
                ?>
                <article class="cart-line">
                    <a class="cart-line__img" href="<?= e(url('product.php?slug=' . $p['slug'])) ?>">
                        <img src="<?= e(product_image_url($p['image'])) ?>" alt="">
                    </a>
                    <div>
                        <h2><a href="<?= e(url('product.php?slug=' . $p['slug'])) ?>"><?= e($p['name']) ?></a></h2>
                        <p class="muted"><?= e(money((float) $p['price'])) ?> · <?= (int) $p['stock'] ?> left</p>
                        <label class="qty-inline">
                            Qty
                            <input form="update-bag" type="number" name="qty[<?= (int) $p['id'] ?>]" min="1" max="<?= (int) $p['stock'] ?>" value="<?= (int) $line['qty'] ?>">
                        </label>
                        <form method="post" class="inline-form">
                            <?= csrf_field() ?>
                            <input type="hidden" name="action" value="remove">
                            <input type="hidden" name="product_id" value="<?= (int) $p['id'] ?>">
                            <button class="linkish" type="submit">Remove</button>
                        </form>
                    </div>
                    <p class="price"><?= e(money($line['line_total'])) ?></p>
                </article>
            <?php endforeach; ?>
            <button class="btn btn--ghost" form="update-bag" type="submit">Update bag</button>
        </div>
        <aside class="cart-summary">
            <h2>Summary</h2>
            <p class="summary-row"><span>Subtotal</span><strong><?= e(money(cart_subtotal())) ?></strong></p>
            <p class="muted">Delivery is confirmed when we call about your COD order. No payment online.</p>
            <a class="btn btn--primary btn--block" href="<?= e(url('checkout.php')) ?>">Checkout</a>
        </aside>
    </div>
<?php endif; ?>

<?php require PT_ROOT . '/includes/footer.php'; ?>

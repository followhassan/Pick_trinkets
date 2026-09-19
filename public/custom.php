<?php
require_once dirname(__DIR__) . '/includes/bootstrap.php';

$pageTitle = 'Custom orders — Pick Trinkets';
$pageDescription = 'Custom phone charm made for a customer. DM to place your orders. Pick Trinkets, Dhaka.';
require PT_ROOT . '/includes/header.php';
?>

<article class="about">
    <p class="eyebrow">Custom</p>
    <h1>Made for a customer — yours next.</h1>
    <p class="lede">Custom phone charm made for a customer. DM to place your orders.</p>
    <p>Send a reference, colours, and whether it is for a phone, a bag, or a wrist. We reply on Facebook (or email) with a price in BDT, make it in Dhaka, and send cash on delivery.</p>
    <ul class="steps">
        <li>Phone charms — beads, bows, initials, matching a case colour.</li>
        <li>Bag charms — headphones, pearls, berries, heavier clips.</li>
        <li>Bracelets — pearl, bamboo, blossom, length to fit.</li>
    </ul>
    <p>Ready-made pieces stay in the <a href="<?= e(url('shop.php')) ?>">shop</a> if you need something this week.</p>
    <p>
        <a class="btn btn--primary" href="<?= e($fb) ?>" target="_blank" rel="noopener">DM on Facebook</a>
        <a class="btn btn--ghost" href="mailto:<?= e($email) ?>">Email <?= e($email) ?></a>
    </p>
</article>

<?php require PT_ROOT . '/includes/footer.php'; ?>

<?php
require_once dirname(__DIR__) . '/includes/bootstrap.php';

$pageTitle = 'About Pick Trinkets — Dhaka handmade accessories';
$pageDescription = 'Pick Trinkets is a Dhaka shop for cute handmade phone charms, bag charms, and bracelets. Custom orders. picktrinkets@gmail.com';
require PT_ROOT . '/includes/header.php';
?>

<article class="about">
    <img class="about-logo" src="<?= e(asset('img/logo.png')) ?>" alt="Pick Trinkets" width="120" height="120">
    <p class="eyebrow"><?= e($location) ?></p>
    <h1>Pick Trinkets</h1>
    <p class="lede"><?= e($tagline) ?> — phone charms, bag charms, and bracelets, made by hand in Dhaka.</p>
    <p>We make small, wearable pieces: pearls, blossoms, bamboo beads, headphone charms, custom mixes. Ready-made items sit in the shop. If you want something in your colours, that is a custom order — we hear that request almost every week.</p>
    <p>Payment is cash on delivery. We call or message to confirm, then pack. Delivery charge depends on where you are in Bangladesh.</p>
    <ul class="contact-list">
        <li><strong>Email</strong> <a href="mailto:<?= e($email) ?>"><?= e($email) ?></a></li>
        <li><strong>Facebook</strong> <a href="<?= e($fb) ?>" target="_blank" rel="noopener">facebook.com/picktrinkets</a></li>
        <li><strong>Instagram</strong> <a href="<?= e($ig) ?>" target="_blank" rel="noopener">@picktrinkets</a></li>
        <li><strong>Studio</strong> <?= e($location) ?></li>
    </ul>
    <p>
        <a class="btn btn--primary" href="<?= e($fb) ?>" target="_blank" rel="noopener">Facebook page</a>
        <a class="btn btn--ghost" href="<?= e(url('custom.php')) ?>">Ask for a custom piece</a>
    </p>
    <h2>How ordering works</h2>
    <ol class="steps">
        <li>Add a ready piece to your bag, or DM us for a custom charm.</li>
        <li>Check out with name, phone, address, and city — or confirm the brief on Facebook.</li>
        <li>We confirm, then send COD. Pay the courier when it arrives.</li>
    </ol>
</article>

<?php require PT_ROOT . '/includes/footer.php'; ?>

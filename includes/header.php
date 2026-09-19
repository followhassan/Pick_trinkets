<?php
/** @var string $pageTitle */
/** @var string $pageDescription */
$pageTitle = $pageTitle ?? 'Pick Trinkets';
$pageDescription = $pageDescription ?? 'Cute handmade accessories from Dhaka — phone charms, bag charms, and bracelets. Custom orders. Cash on delivery.';
$flash = flash_get();
$cartN = cart_count();
$fb = $config['app']['facebook'] ?? 'https://www.facebook.com/picktrinkets/';
$ig = $config['app']['instagram'] ?? 'https://www.instagram.com/picktrinkets/';
$email = $config['app']['email'] ?? 'picktrinkets@gmail.com';
$tagline = $config['app']['tagline'] ?? 'Cute handmade accessories';
$location = $config['app']['location'] ?? 'Dhaka, Bangladesh';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e($pageTitle) ?></title>
    <meta name="description" content="<?= e($pageDescription) ?>">
    <link rel="icon" href="<?= e(asset('img/favicon-32.png')) ?>" type="image/png" sizes="32x32">
    <link rel="apple-touch-icon" href="<?= e(asset('img/apple-touch.png')) ?>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Nunito:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= e(asset('css/style.css')) ?>">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<div class="announcement">
    <?= e($tagline) ?> · Custom orders · <?= e($location) ?> · Cash on delivery
</div>
<header class="site-header">
    <div class="header-inner">
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
            <span class="sr-only">Menu</span>
            <span></span><span></span>
        </button>
        <a class="brand" href="<?= e(url()) ?>">
            <img src="<?= e(asset('img/logo.png')) ?>" alt="Pick Trinkets" width="48" height="48">
            <span class="brand-text">Pick <em>Trinkets</em></span>
        </a>
        <nav id="site-nav" class="site-nav">
            <a class="<?= e(is_active('index.php')) ?>" href="<?= e(url()) ?>">Home</a>
            <a class="<?= e(is_active('shop.php')) ?>" href="<?= e(url('shop.php')) ?>">Shop</a>
            <a href="<?= e(url('shop.php?category=phone-charms')) ?>">Phone charms</a>
            <a href="<?= e(url('shop.php?category=bag-charms')) ?>">Bag charms</a>
            <a href="<?= e(url('shop.php?category=bracelets')) ?>">Bracelets</a>
            <a class="<?= e(is_active('custom.php')) ?>" href="<?= e(url('custom.php')) ?>">Custom</a>
            <a class="<?= e(is_active('about.php')) ?>" href="<?= e(url('about.php')) ?>">About</a>
        </nav>
        <a class="cart-link" href="<?= e(url('cart.php')) ?>">
            <svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22"><path fill="currentColor" d="M7 6V5a5 5 0 0 1 10 0v1h2.2a1 1 0 0 1 .98 1.2l-1.6 8A2 2 0 0 1 16.62 17H8.38a2 2 0 0 1-1.96-1.8l-1.6-8A1 1 0 0 1 5.8 6H7zm2 0h6V5a3 3 0 0 0-6 0v1z"/></svg>
            <span>Bag</span>
            <?php if ($cartN > 0): ?>
                <span class="cart-count"><?= (int) $cartN ?></span>
            <?php endif; ?>
        </a>
    </div>
</header>
<?php if ($flash): ?>
    <div class="flash flash--<?= e($flash['type']) ?>"><?= e($flash['message']) ?></div>
<?php endif; ?>
<main id="main">

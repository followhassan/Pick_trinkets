<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($title ?? 'Pick Trinkets') ?></title>
  <meta name="description" content="Pick Trinkets — cute handmade phone charms, bag charms, and bracelets from Dhaka, Bangladesh. Custom orders welcome.">
  <link rel="icon" href="<?= e(asset('img/favicon.ico')) ?>">
  <link rel="apple-touch-icon" href="<?= e(asset('img/apple-touch-icon.png')) ?>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= e(asset('css/style.css')) ?>">
</head>
<body>
  <div class="announce">Cute handmade accessories · Dhaka · Cash on delivery · Custom orders available</div>
  <header class="site-header">
    <div class="wrap header-row">
      <a class="brand" href="<?= e(url('/')) ?>">
        <img src="<?= e(asset('img/logo.png')) ?>" alt="Pick Trinkets logo">
        <span>
          <span class="brand-name">Pick Trinkets</span>
          <span class="brand-tag">Cute handmade accessories</span>
        </span>
      </a>
      <nav class="nav">
        <a href="<?= e(url('/')) ?>">Home</a>
        <a href="<?= e(url('/shop')) ?>">Shop</a>
        <a href="<?= e(url('/shop?category=phone-charms')) ?>">Phone charms</a>
        <a href="<?= e(url('/shop?category=bag-charms')) ?>">Bag charms</a>
        <a href="<?= e(url('/shop?category=bracelets')) ?>">Bracelets</a>
        <a href="<?= e(url('/about')) ?>">About</a>
      </nav>
      <div class="header-tools">
        <a href="<?= e(url('/shop')) ?>">Search</a>
        <a class="bag-link" href="<?= e(url('/bag')) ?>">Bag <span class="bag-count"><?= (int) cart_count() ?></span></a>
      </div>
    </div>
  </header>
  <?php if ($msg = flash('success')): ?>
    <div class="flash ok"><?= e($msg) ?></div>
  <?php endif; ?>
  <?php if ($msg = flash('error')): ?>
    <div class="flash err"><?= e($msg) ?></div>
  <?php endif; ?>
  <main>
    <?= $content ?>
  </main>
  <footer class="site-footer">
    <div class="wrap footer-grid">
      <div>
        <h3>Pick Trinkets</h3>
        <p>Cute handmade accessories from Dhaka, Bangladesh. Phone charms, bag charms, and bracelets — plus custom orders if you have a colour or character in mind.</p>
      </div>
      <div>
        <h3>Visit</h3>
        <p>Dhaka, Bangladesh</p>
        <p><a href="mailto:picktrinkets@gmail.com">picktrinkets@gmail.com</a></p>
      </div>
      <div>
        <h3>Say hi</h3>
        <p><a href="https://www.facebook.com/picktrinkets/" target="_blank" rel="noreferrer">Facebook</a></p>
        <p><a href="https://www.instagram.com/picktrinkets/" target="_blank" rel="noreferrer">Instagram @picktrinkets</a></p>
        <p><a href="<?= e(url('/admin/login')) ?>">Staff</a></p>
      </div>
    </div>
    <div class="wrap copy">© <?= date('Y') ?> Pick Trinkets. Handmade in Dhaka.</div>
  </footer>
</body>
</html>

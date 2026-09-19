<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($title ?? 'Admin') ?></title>
  <link rel="icon" href="<?= e(asset('img/favicon.ico')) ?>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Nunito:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?= e(asset('css/style.css')) ?>">
</head>
<body class="admin-shell">
  <div class="admin-top">
    <strong>Pick Trinkets staff</strong>
    <nav class="admin-nav">
      <?php if (current_staff()): ?>
        <a href="<?= e(url('/admin/orders')) ?>">Orders</a>
        <a href="<?= e(url('/admin/products')) ?>">Products</a>
        <a href="<?= e(url('/')) ?>">View shop</a>
        <form method="post" action="<?= e(url('/admin/logout')) ?>" style="margin:0">
          <?= csrf_field() ?>
          <button class="btn ghost" type="submit">Sign out</button>
        </form>
      <?php endif; ?>
    </nav>
  </div>
  <?php if ($msg = flash('success')): ?>
    <div class="flash ok"><?= e($msg) ?></div>
  <?php endif; ?>
  <?php if ($msg = flash('error')): ?>
    <div class="flash err"><?= e($msg) ?></div>
  <?php endif; ?>
  <?= $content ?>
</body>
</html>

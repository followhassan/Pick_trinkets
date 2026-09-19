<?php
require_once dirname(__DIR__) . '/includes/bootstrap.php';
http_response_code(404);
$pageTitle = 'Not found — Pick Trinkets';
require PT_ROOT . '/includes/header.php';
?>
<div class="empty">
    <h1>404 — this page is sold out of existence</h1>
    <p>Try the shop instead.</p>
    <a class="btn btn--primary" href="<?= e(url('shop.php')) ?>">Shop trinkets</a>
</div>
<?php require PT_ROOT . '/includes/footer.php'; ?>

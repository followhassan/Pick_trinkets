<?php
require_once dirname(__DIR__, 2) . '/includes/bootstrap.php';

if (admin_user()) {
    redirect('admin/index.php');
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_verify();
    $user = trim((string) ($_POST['username'] ?? ''));
    $pass = (string) ($_POST['password'] ?? '');
    if (attempt_login($user, $pass)) {
        redirect('admin/index.php');
    }
    $error = 'Those details did not match.';
}

$pageTitle = 'Staff login — Pick Trinkets';
require PT_ROOT . '/includes/header.php';
?>

<section class="auth-card">
    <p class="eyebrow">Staff</p>
    <h1>Log in</h1>
    <?php if ($error): ?><p class="flash flash--error"><?= e($error) ?></p><?php endif; ?>
    <form method="post" class="checkout-form">
        <?= csrf_field() ?>
        <label>Username
            <input name="username" required autocomplete="username">
        </label>
        <label>Password
            <input type="password" name="password" required autocomplete="current-password">
        </label>
        <button class="btn btn--primary" type="submit">Enter</button>
    </form>
</section>

<?php require PT_ROOT . '/includes/footer.php'; ?>

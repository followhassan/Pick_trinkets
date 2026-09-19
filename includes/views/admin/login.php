<div class="login-box">
  <p class="kicker">Staff only</p>
  <h1>Sign in</h1>
  <form class="form" method="post" action="<?= e(url('/admin/login')) ?>">
    <?= csrf_field() ?>
    <label for="username">Username</label>
    <input id="username" name="username" required autocomplete="username">
    <label for="password">Password</label>
    <input id="password" name="password" type="password" required autocomplete="current-password">
    <button class="btn" type="submit">Enter studio</button>
  </form>
  <p class="muted">Default seed login is <code>admin</code> / <code>picktrinkets</code>. Change it before production.</p>
</div>

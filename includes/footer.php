</main>
<footer class="site-footer">
    <div class="footer-inner">
        <div>
            <a class="brand brand--footer" href="<?= e(url()) ?>">
                <img src="<?= e(asset('img/logo.png')) ?>" alt="Pick Trinkets" width="44" height="44">
                <span class="brand-text">Pick <em>Trinkets</em></span>
            </a>
            <p class="footer-blurb"><?= e($tagline) ?> from <?= e($location) ?>. Phone charms, bag charms, and bracelets — including custom pieces. Packed with care, sent cash on delivery.</p>
        </div>
        <div>
            <h2>Shop</h2>
            <a href="<?= e(url('shop.php')) ?>">All pieces</a>
            <a href="<?= e(url('shop.php?category=phone-charms')) ?>">Phone charms</a>
            <a href="<?= e(url('shop.php?category=bag-charms')) ?>">Bag charms</a>
            <a href="<?= e(url('shop.php?category=bracelets')) ?>">Bracelets</a>
            <a href="<?= e(url('custom.php')) ?>">Custom orders</a>
        </div>
        <div>
            <h2>Visit</h2>
            <a href="<?= e($fb) ?>" rel="noopener noreferrer" target="_blank">Facebook — picktrinkets</a>
            <a href="<?= e($ig) ?>" rel="noopener noreferrer" target="_blank">Instagram — @picktrinkets</a>
            <a href="mailto:<?= e($email) ?>"><?= e($email) ?></a>
            <a href="<?= e(url('about.php')) ?>">About the shop</a>
            <a href="<?= e(url('admin/login.php')) ?>">Staff login</a>
            <p class="muted"><?= e($location) ?> · COD nationwide</p>
        </div>
    </div>
    <p class="copyright">© <?= date('Y') ?> Pick Trinkets · <?= e($location) ?></p>
</footer>
<script src="<?= e(asset('js/shop.js')) ?>" defer></script>
</body>
</html>

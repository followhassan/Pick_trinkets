<?php

declare(strict_types=1);

function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function base_url(): string
{
    global $config;
    $configured = trim((string) ($config['app']['base_url'] ?? ''), '/');
    if ($configured !== '') {
        return '/' . $configured;
    }

    $script = str_replace('\\', '/', $_SERVER['SCRIPT_NAME'] ?? '');
    $dir = dirname($script);
    if (str_ends_with($dir, '/admin')) {
        $dir = dirname($dir);
    }
    if ($dir === '/' || $dir === '.' || $dir === '\\') {
        return '';
    }
    return rtrim($dir, '/');
}

function url(string $path = ''): string
{
    $path = ltrim($path, '/');
    $base = base_url();
    if ($path === '') {
        return $base === '' ? '/' : $base . '/';
    }
    return ($base === '' ? '' : $base) . '/' . $path;
}

function asset(string $path): string
{
    return url('assets/' . ltrim($path, '/'));
}

function money(float|int|string $amount): string
{
    return 'Tk ' . number_format((float) $amount, 2) . ' BDT';
}

function redirect(string $path): never
{
    if (!str_starts_with($path, 'http://') && !str_starts_with($path, 'https://')) {
        $path = url(ltrim($path, '/'));
    }
    header('Location: ' . $path);
    exit;
}

function csrf_token(): string
{
    if (empty($_SESSION['_csrf'])) {
        $_SESSION['_csrf'] = bin2hex(random_bytes(16));
    }
    return $_SESSION['_csrf'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="_csrf" value="' . e(csrf_token()) . '">';
}

function csrf_verify(): void
{
    $token = $_POST['_csrf'] ?? '';
    if (!is_string($token) || !hash_equals($_SESSION['_csrf'] ?? '', $token)) {
        http_response_code(400);
        exit('Invalid form token. Please go back and try again.');
    }
}

function flash_set(string $type, string $message): void
{
    $_SESSION['_flash'] = ['type' => $type, 'message' => $message];
}

function flash_get(): ?array
{
    $flash = $_SESSION['_flash'] ?? null;
    unset($_SESSION['_flash']);
    return is_array($flash) ? $flash : null;
}

function current_script(): string
{
    return basename($_SERVER['SCRIPT_NAME'] ?? '');
}

function is_active(string $script): string
{
    return current_script() === $script ? 'is-active' : '';
}

function slugify(string $text): string
{
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
    return trim($text, '-');
}

function product_image_url(string $filename): string
{
    $filename = basename($filename);
    if ($filename === '') {
        return asset('img/placeholder.svg');
    }
    $path = PT_ROOT . '/public/assets/products/' . $filename;
    if (!is_file($path)) {
        return asset('img/placeholder.svg');
    }
    return asset('products/' . $filename);
}

function fetch_categories(): array
{
    return db()->query('SELECT * FROM categories ORDER BY name')->fetchAll();
}

function fetch_product_by_slug(string $slug): ?array
{
    $stmt = db()->prepare(
        'SELECT p.*, c.name AS category_name, c.slug AS category_slug
         FROM products p JOIN categories c ON c.id = p.category_id
         WHERE p.slug = ? LIMIT 1'
    );
    $stmt->execute([$slug]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function fetch_product(int $id): ?array
{
    $stmt = db()->prepare(
        'SELECT p.*, c.name AS category_name, c.slug AS category_slug
         FROM products p JOIN categories c ON c.id = p.category_id
         WHERE p.id = ? LIMIT 1'
    );
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function in_stock(array $product): bool
{
    return (int) $product['stock'] > 0;
}

function render_product_card(array $p): void
{
    $sold = !in_stock($p);
    ?>
    <article class="product-card<?= $sold ? ' is-soldout' : '' ?>">
        <a class="product-card__media" href="<?= e(url('product.php?slug=' . $p['slug'])) ?>">
            <img src="<?= e(product_image_url($p['image'])) ?>" alt="<?= e($p['name']) ?>" width="600" height="600" loading="lazy">
            <?php if ($sold): ?>
                <span class="badge badge--sold">Sold out</span>
            <?php elseif (!empty($p['is_featured'])): ?>
                <span class="badge badge--new">Pick</span>
            <?php endif; ?>
        </a>
        <div class="product-card__body">
            <h3><a href="<?= e(url('product.php?slug=' . $p['slug'])) ?>"><?= e($p['name']) ?></a></h3>
            <p class="price"><?= e(money($p['price'])) ?></p>
        </div>
    </article>
    <?php
}

function bd_phone_ok(string $phone): bool
{
    $digits = preg_replace('/\D+/', '', $phone) ?? '';
    if (str_starts_with($digits, '880') && strlen($digits) === 13) {
        $digits = substr($digits, 2);
    }
    return (bool) preg_match('/^01[3-9]\d{8}$/', $digits);
}

function order_code(): string
{
    return 'PT-' . strtoupper(bin2hex(random_bytes(3)));
}

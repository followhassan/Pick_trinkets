<?php

function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function config(string $key, $default = null)
{
    global $CONFIG;
    return $CONFIG[$key] ?? $default;
}

function url(string $path = '/'): string
{
    $base = rtrim((string) config('base_url', ''), '/');
    if ($path === '') {
        $path = '/';
    }
    if ($path[0] !== '/') {
        $path = '/' . $path;
    }
    return $base . $path;
}

function asset(string $path): string
{
    $path = ltrim($path, '/');
    return url('/assets/' . $path);
}

function product_image_url(string $image): string
{
    $image = ltrim($image, '/');
    if (str_starts_with($image, 'uploads/')) {
        return url('/' . $image);
    }
    if (str_starts_with($image, 'assets/')) {
        return url('/' . $image);
    }
    return url('/assets/' . $image);
}

function money($amount): string
{
    return 'Tk ' . number_format((float) $amount, 2);
}

function redirect(string $path, int $code = 302): void
{
    header('Location: ' . url($path), true, $code);
    exit;
}

function request_path(): string
{
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $path = '/' . trim($path, '/');
    return $path === '/' ? '/' : rtrim($path, '/');
}

function request_method(): string
{
    return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
}

function is_post(): bool
{
    return request_method() === 'POST';
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
    if (!is_string($token) || !hash_equals(csrf_token(), $token)) {
        http_response_code(400);
        echo 'Invalid request token. Please go back and try again.';
        exit;
    }
}

function flash(string $key, ?string $message = null)
{
    if ($message === null) {
        if (!isset($_SESSION['_flash'][$key])) {
            return null;
        }
        $value = $_SESSION['_flash'][$key];
        unset($_SESSION['_flash'][$key]);
        return $value;
    }
    $_SESSION['_flash'][$key] = $message;
}

function old(string $key, string $default = ''): string
{
    $bag = $_SESSION['_old'] ?? [];
    return (string) ($bag[$key] ?? $default);
}

function set_old(array $data): void
{
    $_SESSION['_old'] = $data;
}

function clear_old(): void
{
    unset($_SESSION['_old']);
}

function slugify(string $text): string
{
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
    return trim($text, '-') ?: 'item';
}

function unique_slug(PDO $pdo, string $base, ?int $ignoreId = null): string
{
    $slug = slugify($base);
    $i = 2;
    $candidate = $slug;
    while (true) {
        $sql = 'SELECT id FROM products WHERE slug = ?';
        $params = [$candidate];
        if ($ignoreId) {
            $sql .= ' AND id != ?';
            $params[] = $ignoreId;
        }
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        if (!$stmt->fetch()) {
            return $candidate;
        }
        $candidate = $slug . '-' . $i;
        $i++;
    }
}

function render(string $view, array $data = [], string $layout = 'main'): void
{
    extract($data, EXTR_SKIP);
    $viewFile = APP_ROOT . '/includes/views/' . $view . '.php';
    if (!is_file($viewFile)) {
        http_response_code(500);
        echo 'View missing: ' . e($view);
        return;
    }
    ob_start();
    include $viewFile;
    $content = ob_get_clean();
    if ($layout === 'none') {
        echo $content;
        return;
    }
    $layoutFile = APP_ROOT . '/includes/views/layouts/' . $layout . '.php';
    include $layoutFile;
}

function not_found(): void
{
    http_response_code(404);
    render('errors/404', ['title' => 'Not found']);
}

function json_input_trim(?string $value): string
{
    return trim((string) $value);
}

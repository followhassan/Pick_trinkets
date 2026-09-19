<?php
/**
 * Router for PHP's built-in server: php -S 127.0.0.1:43123 -t public public/router.php
 */
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$file = __DIR__ . $uri;

if ($uri !== '/' && is_file($file)) {
    return false;
}

$map = [
    '/' => 'index.php',
    '/index.php' => 'index.php',
    '/shop' => 'shop.php',
    '/cart' => 'cart.php',
    '/checkout' => 'checkout.php',
    '/about' => 'about.php',
    '/custom' => 'custom.php',
    '/success' => 'success.php',
];

if (isset($map[$uri])) {
    require __DIR__ . '/' . $map[$uri];
    return true;
}

if (preg_match('#^/product/([a-z0-9-]+)/?$#', $uri, $m)) {
    $_GET['slug'] = $m[1];
    require __DIR__ . '/product.php';
    return true;
}

http_response_code(404);
require __DIR__ . '/404.php';
return true;

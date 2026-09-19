<?php

declare(strict_types=1);

function cart(): array
{
    if (!isset($_SESSION['cart']) || !is_array($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
    }
    return $_SESSION['cart'];
}

function cart_count(): int
{
    $n = 0;
    foreach (cart() as $qty) {
        $n += (int) $qty;
    }
    return $n;
}

function cart_add(int $productId, int $qty = 1): string
{
    $product = fetch_product($productId);
    if (!$product) {
        return 'That trinket is no longer listed.';
    }
    if (!in_stock($product)) {
        return 'Sorry — ' . $product['name'] . ' is sold out.';
    }

    $qty = max(1, $qty);
    $current = (int) (cart()[$productId] ?? 0);
    $next = min($current + $qty, (int) $product['stock']);
    if ($next === $current && $current >= (int) $product['stock']) {
        return 'You already have all remaining stock of ' . $product['name'] . ' in your bag.';
    }
    $_SESSION['cart'][$productId] = $next;
    return '';
}

function cart_update(int $productId, int $qty): void
{
    if ($qty <= 0) {
        unset($_SESSION['cart'][$productId]);
        return;
    }
    $product = fetch_product($productId);
    if (!$product) {
        unset($_SESSION['cart'][$productId]);
        return;
    }
    $_SESSION['cart'][$productId] = min($qty, max(0, (int) $product['stock']));
    if ($_SESSION['cart'][$productId] <= 0) {
        unset($_SESSION['cart'][$productId]);
    }
}

function cart_remove(int $productId): void
{
    unset($_SESSION['cart'][$productId]);
}

function cart_clear(): void
{
    $_SESSION['cart'] = [];
}

function cart_lines(): array
{
    $lines = [];
    foreach (cart() as $id => $qty) {
        $product = fetch_product((int) $id);
        if (!$product) {
            unset($_SESSION['cart'][$id]);
            continue;
        }
        $qty = (int) $qty;
        $lines[] = [
            'product' => $product,
            'qty' => $qty,
            'line_total' => (float) $product['price'] * $qty,
        ];
    }
    return $lines;
}

function cart_subtotal(): float
{
    $sum = 0.0;
    foreach (cart_lines() as $line) {
        $sum += $line['line_total'];
    }
    return $sum;
}

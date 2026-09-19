<?php

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

function cart_add(int $productId, int $qty = 1): void
{
    $qty = max(1, $qty);
    $cart = cart();
    $cart[$productId] = ($cart[$productId] ?? 0) + $qty;
    $_SESSION['cart'] = $cart;
}

function cart_set(int $productId, int $qty): void
{
    $cart = cart();
    if ($qty <= 0) {
        unset($cart[$productId]);
    } else {
        $cart[$productId] = $qty;
    }
    $_SESSION['cart'] = $cart;
}

function cart_remove(int $productId): void
{
    $cart = cart();
    unset($cart[$productId]);
    $_SESSION['cart'] = $cart;
}

function cart_clear(): void
{
    $_SESSION['cart'] = [];
}

function cart_items(PDO $pdo): array
{
    $cart = cart();
    if (!$cart) {
        return [];
    }
    $ids = array_map('intval', array_keys($cart));
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $stmt = $pdo->prepare(
        "SELECT p.*, c.name AS category_name, c.slug AS category_slug
         FROM products p
         JOIN categories c ON c.id = p.category_id
         WHERE p.id IN ($placeholders)"
    );
    $stmt->execute($ids);
    $rows = $stmt->fetchAll();
    $items = [];
    foreach ($rows as $row) {
        $id = (int) $row['id'];
        $qty = (int) ($cart[$id] ?? 0);
        if ($qty < 1) {
            continue;
        }
        $row['qty'] = $qty;
        $row['line_total'] = (float) $row['price_bdt'] * $qty;
        $items[] = $row;
    }
    return $items;
}

function cart_total(array $items): float
{
    $sum = 0;
    foreach ($items as $item) {
        $sum += (float) $item['line_total'];
    }
    return $sum;
}

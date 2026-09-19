<?php

require dirname(__DIR__) . '/includes/bootstrap.php';

$path = request_path();
$method = request_method();

try {
    dispatch($path, $method);
} catch (PDOException $e) {
    http_response_code(500);
    if (str_contains($e->getMessage(), 'Unknown database') || str_contains($e->getMessage(), '1049')) {
        echo 'Database not found. Import sql/schema.sql and sql/seed.sql first.';
        return;
    }
    echo 'Database error. Check config.php and that MySQL is running.';
}

function dispatch(string $path, string $method): void
{
    $pdo = db();

    if ($method === 'POST' && $path === '/bag/add') {
        csrf_verify();
        handle_bag_add($pdo);
        return;
    }
    if ($method === 'POST' && $path === '/bag/update') {
        csrf_verify();
        handle_bag_update($pdo);
        return;
    }
    if ($method === 'POST' && $path === '/bag/remove') {
        csrf_verify();
        handle_bag_remove();
        return;
    }
    if ($method === 'POST' && $path === '/checkout') {
        csrf_verify();
        handle_checkout($pdo);
        return;
    }
    if ($method === 'POST' && $path === '/admin/login') {
        csrf_verify();
        handle_admin_login($pdo);
        return;
    }
    if ($method === 'POST' && $path === '/admin/logout') {
        csrf_verify();
        staff_logout();
        flash('success', 'Signed out.');
        redirect('/admin/login');
    }
    if ($method === 'POST' && $path === '/admin/products/save') {
        csrf_verify();
        require_staff();
        handle_product_save($pdo);
        return;
    }
    if ($method === 'POST' && $path === '/admin/products/delete') {
        csrf_verify();
        require_staff();
        handle_product_delete($pdo);
        return;
    }
    if ($method === 'POST' && preg_match('#^/admin/orders/(\d+)/status$#', $path, $m)) {
        csrf_verify();
        require_staff();
        handle_order_status($pdo, (int) $m[1]);
        return;
    }

    if ($method !== 'GET' && $method !== 'HEAD') {
        http_response_code(405);
        echo 'Method not allowed';
        return;
    }

    if ($path === '/') {
        $featured = $pdo->query(
            "SELECT p.*, c.name AS category_name, c.slug AS category_slug
             FROM products p
             JOIN categories c ON c.id = p.category_id
             WHERE p.is_active = 1
             ORDER BY p.stock = 0, p.id
             LIMIT 8"
        )->fetchAll();
        $categories = fetch_categories($pdo);
        render('home', [
            'title' => 'Pick Trinkets — cute handmade accessories',
            'featured' => $featured,
            'categories' => $categories,
        ]);
        return;
    }

    if ($path === '/shop') {
        $categories = fetch_categories($pdo);
        $q = trim((string) ($_GET['q'] ?? ''));
        $cat = trim((string) ($_GET['category'] ?? ''));
        $sql = "SELECT p.*, c.name AS category_name, c.slug AS category_slug
                FROM products p
                JOIN categories c ON c.id = p.category_id
                WHERE p.is_active = 1";
        $params = [];
        if ($cat !== '') {
            $sql .= ' AND c.slug = ?';
            $params[] = $cat;
        }
        if ($q !== '') {
            $sql .= ' AND (p.name LIKE ? OR p.description LIKE ?)';
            $like = '%' . $q . '%';
            $params[] = $like;
            $params[] = $like;
        }
        $sql .= ' ORDER BY p.stock = 0, p.name';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $products = $stmt->fetchAll();
        $activeCategory = null;
        foreach ($categories as $c) {
            if ($c['slug'] === $cat) {
                $activeCategory = $c;
                break;
            }
        }
        $title = $activeCategory ? $activeCategory['name'] . ' — Pick Trinkets' : 'Shop — Pick Trinkets';
        render('shop', [
            'title' => $title,
            'products' => $products,
            'categories' => $categories,
            'q' => $q,
            'cat' => $cat,
        ]);
        return;
    }

    if (preg_match('#^/product/([a-z0-9-]+)$#', $path, $m)) {
        $stmt = $pdo->prepare(
            "SELECT p.*, c.name AS category_name, c.slug AS category_slug
             FROM products p
             JOIN categories c ON c.id = p.category_id
             WHERE p.slug = ? AND p.is_active = 1
             LIMIT 1"
        );
        $stmt->execute([$m[1]]);
        $product = $stmt->fetch();
        if (!$product) {
            not_found();
            return;
        }
        $related = $pdo->prepare(
            "SELECT p.*, c.name AS category_name, c.slug AS category_slug
             FROM products p
             JOIN categories c ON c.id = p.category_id
             WHERE p.is_active = 1 AND p.category_id = ? AND p.id != ?
             ORDER BY p.stock = 0, p.id
             LIMIT 4"
        );
        $related->execute([(int) $product['category_id'], (int) $product['id']]);
        render('product', [
            'title' => $product['name'] . ' — Pick Trinkets',
            'product' => $product,
            'related' => $related->fetchAll(),
        ]);
        return;
    }

    if ($path === '/bag') {
        $items = cart_items($pdo);
        render('bag', [
            'title' => 'Shopping bag — Pick Trinkets',
            'items' => $items,
            'total' => cart_total($items),
        ]);
        return;
    }

    if ($path === '/checkout') {
        $items = cart_items($pdo);
        if (!$items) {
            flash('error', 'Your bag is empty.');
            redirect('/shop');
        }
        render('checkout', [
            'title' => 'Checkout — Pick Trinkets',
            'items' => $items,
            'total' => cart_total($items),
        ]);
        return;
    }

    if ($path === '/about') {
        render('about', ['title' => 'About — Pick Trinkets']);
        return;
    }

    if ($path === '/admin' || $path === '/admin/login') {
        if (current_staff()) {
            redirect('/admin/orders');
        }
        render('admin/login', ['title' => 'Staff login — Pick Trinkets'], 'admin');
        return;
    }

    if ($path === '/admin/products') {
        require_staff();
        $products = $pdo->query(
            "SELECT p.*, c.name AS category_name
             FROM products p
             JOIN categories c ON c.id = p.category_id
             ORDER BY p.id DESC"
        )->fetchAll();
        render('admin/products', [
            'title' => 'Products — Admin',
            'products' => $products,
        ], 'admin');
        return;
    }

    if ($path === '/admin/products/new') {
        require_staff();
        render('admin/product_form', [
            'title' => 'New product — Admin',
            'product' => null,
            'categories' => fetch_categories($pdo),
        ], 'admin');
        return;
    }

    if (preg_match('#^/admin/products/(\d+)/edit$#', $path, $m)) {
        require_staff();
        $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
        $stmt->execute([(int) $m[1]]);
        $product = $stmt->fetch();
        if (!$product) {
            flash('error', 'Product not found.');
            redirect('/admin/products');
        }
        render('admin/product_form', [
            'title' => 'Edit product — Admin',
            'product' => $product,
            'categories' => fetch_categories($pdo),
        ], 'admin');
        return;
    }

    if ($path === '/admin/orders') {
        require_staff();
        $orders = $pdo->query(
            'SELECT * FROM orders ORDER BY id DESC'
        )->fetchAll();
        render('admin/orders', [
            'title' => 'Orders — Admin',
            'orders' => $orders,
        ], 'admin');
        return;
    }

    if (preg_match('#^/admin/orders/(\d+)$#', $path, $m)) {
        require_staff();
        $stmt = $pdo->prepare('SELECT * FROM orders WHERE id = ?');
        $stmt->execute([(int) $m[1]]);
        $order = $stmt->fetch();
        if (!$order) {
            flash('error', 'Order not found.');
            redirect('/admin/orders');
        }
        $items = $pdo->prepare(
            'SELECT oi.*, p.slug, p.image
             FROM order_items oi
             LEFT JOIN products p ON p.id = oi.product_id
             WHERE oi.order_id = ?'
        );
        $items->execute([(int) $order['id']]);
        render('admin/order_show', [
            'title' => 'Order #' . $order['id'] . ' — Admin',
            'order' => $order,
            'items' => $items->fetchAll(),
        ], 'admin');
        return;
    }

    not_found();
}

function fetch_categories(PDO $pdo): array
{
    return $pdo->query('SELECT * FROM categories ORDER BY sort_order, name')->fetchAll();
}

function handle_bag_add(PDO $pdo): void
{
    $id = (int) ($_POST['product_id'] ?? 0);
    $qty = max(1, (int) ($_POST['qty'] ?? 1));
    $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ? AND is_active = 1');
    $stmt->execute([$id]);
    $product = $stmt->fetch();
    if (!$product) {
        flash('error', 'That piece is no longer available.');
        redirect('/shop');
    }
    if ((int) $product['stock'] < 1) {
        flash('error', 'Sold out — message us for a custom remake.');
        redirect('/product/' . $product['slug']);
    }
    $already = (int) (cart()[$id] ?? 0);
    $next = min((int) $product['stock'], $already + $qty);
    cart_set($id, $next);
    flash('success', $product['name'] . ' was added to your bag.');
    redirect('/bag');
}

function handle_bag_update(PDO $pdo): void
{
    $qtys = $_POST['qty'] ?? [];
    if (!is_array($qtys)) {
        redirect('/bag');
    }
    foreach ($qtys as $id => $qty) {
        $id = (int) $id;
        $qty = (int) $qty;
        if ($id < 1) {
            continue;
        }
        $stmt = $pdo->prepare('SELECT stock FROM products WHERE id = ?');
        $stmt->execute([$id]);
        $stock = (int) $stmt->fetchColumn();
        cart_set($id, min(max(0, $qty), max(0, $stock)));
    }
    flash('success', 'Bag updated.');
    redirect('/bag');
}

function handle_bag_remove(): void
{
    cart_remove((int) ($_POST['product_id'] ?? 0));
    flash('success', 'Removed from bag.');
    redirect('/bag');
}

function handle_checkout(PDO $pdo): void
{
    $items = cart_items($pdo);
    if (!$items) {
        flash('error', 'Your bag is empty.');
        redirect('/shop');
    }

    $name = json_input_trim($_POST['customer_name'] ?? '');
    $phone = json_input_trim($_POST['phone'] ?? '');
    $address = json_input_trim($_POST['address'] ?? '');
    $city = json_input_trim($_POST['city'] ?? '');
    $notes = json_input_trim($_POST['notes'] ?? '');

    $errors = [];
    if ($name === '' || mb_strlen($name) < 2) {
        $errors[] = 'Please enter your name.';
    }
    $digits = preg_replace('/\D+/', '', $phone) ?? '';
    if (strlen($digits) < 10 || strlen($digits) > 14) {
        $errors[] = 'Please enter a valid phone number.';
    }
    if ($address === '' || mb_strlen($address) < 8) {
        $errors[] = 'Please enter a full delivery address.';
    }
    if ($city === '') {
        $errors[] = 'Please enter your city.';
    }

    if ($errors) {
        set_old(compact('name', 'phone', 'address', 'city', 'notes'));
        $_SESSION['_old'] = [
            'customer_name' => $name,
            'phone' => $phone,
            'address' => $address,
            'city' => $city,
            'notes' => $notes,
        ];
        flash('error', implode(' ', $errors));
        redirect('/checkout');
    }

    $pdo->beginTransaction();
    try {
        $total = 0;
        $locked = [];
        foreach ($items as $item) {
            $stmt = $pdo->prepare('SELECT id, name, price_bdt, stock FROM products WHERE id = ? FOR UPDATE');
            $stmt->execute([(int) $item['id']]);
            $row = $stmt->fetch();
            if (!$row || (int) $row['stock'] < (int) $item['qty']) {
                throw new RuntimeException($item['name'] . ' does not have enough stock.');
            }
            $row['qty'] = (int) $item['qty'];
            $row['line_total'] = (float) $row['price_bdt'] * $row['qty'];
            $total += $row['line_total'];
            $locked[] = $row;
        }

        $ins = $pdo->prepare(
            'INSERT INTO orders (customer_name, phone, address, city, notes, status, total_bdt)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $ins->execute([$name, $phone, $address, $city, $notes !== '' ? $notes : null, 'pending', $total]);
        $orderId = (int) $pdo->lastInsertId();

        $itemIns = $pdo->prepare(
            'INSERT INTO order_items (order_id, product_id, product_name, unit_price_bdt, qty)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stockUp = $pdo->prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
        foreach ($locked as $row) {
            $itemIns->execute([$orderId, $row['id'], $row['name'], $row['price_bdt'], $row['qty']]);
            $stockUp->execute([$row['qty'], $row['id']]);
        }

        $pdo->commit();
        cart_clear();
        clear_old();
        flash('success', 'Order #' . $orderId . ' placed. We will confirm by phone for cash on delivery.');
        redirect('/shop');
    } catch (Throwable $e) {
        $pdo->rollBack();
        flash('error', $e->getMessage());
        redirect('/checkout');
    }
}

function handle_admin_login(PDO $pdo): void
{
    $username = json_input_trim($_POST['username'] ?? '');
    $password = (string) ($_POST['password'] ?? '');
    if (staff_login($pdo, $username, $password)) {
        flash('success', 'Welcome back.');
        redirect('/admin/orders');
    }
    flash('error', 'Those staff details did not match.');
    redirect('/admin/login');
}

function handle_product_save(PDO $pdo): void
{
    $id = (int) ($_POST['id'] ?? 0);
    $name = json_input_trim($_POST['name'] ?? '');
    $slugIn = json_input_trim($_POST['slug'] ?? '');
    $description = json_input_trim($_POST['description'] ?? '');
    $price = (float) ($_POST['price_bdt'] ?? 0);
    $stock = (int) ($_POST['stock'] ?? 0);
    $categoryId = (int) ($_POST['category_id'] ?? 0);
    $isActive = isset($_POST['is_active']) ? 1 : 0;

    if ($name === '' || $description === '' || $price < 0 || $stock < 0 || $categoryId < 1) {
        flash('error', 'Please fill in name, description, category, price, and stock.');
        redirect($id ? '/admin/products/' . $id . '/edit' : '/admin/products/new');
    }

    $slug = unique_slug($pdo, $slugIn !== '' ? $slugIn : $name, $id ?: null);
    $image = null;

    if (!empty($_FILES['image']['name']) && (int) $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
        $image = save_product_upload($_FILES['image']);
        if ($image === null) {
            flash('error', 'Please upload a JPG, PNG, or WEBP image under 5 MB.');
            redirect($id ? '/admin/products/' . $id . '/edit' : '/admin/products/new');
        }
    }

    if ($id) {
        $current = $pdo->prepare('SELECT image FROM products WHERE id = ?');
        $current->execute([$id]);
        $existing = $current->fetchColumn();
        if ($existing === false) {
            flash('error', 'Product not found.');
            redirect('/admin/products');
        }
        if ($image === null) {
            $image = $existing;
        }
        $stmt = $pdo->prepare(
            'UPDATE products SET category_id=?, slug=?, name=?, description=?, price_bdt=?, stock=?, image=?, is_active=?
             WHERE id=?'
        );
        $stmt->execute([$categoryId, $slug, $name, $description, $price, $stock, $image, $isActive, $id]);
        flash('success', 'Product updated.');
    } else {
        if ($image === null) {
            flash('error', 'A product photo is required.');
            redirect('/admin/products/new');
        }
        $stmt = $pdo->prepare(
            'INSERT INTO products (category_id, slug, name, description, price_bdt, stock, image, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$categoryId, $slug, $name, $description, $price, $stock, $image, $isActive]);
        flash('success', 'Product added.');
    }
    redirect('/admin/products');
}

function handle_product_delete(PDO $pdo): void
{
    $id = (int) ($_POST['id'] ?? 0);
    $used = $pdo->prepare('SELECT COUNT(*) FROM order_items WHERE product_id = ?');
    $used->execute([$id]);
    if ((int) $used->fetchColumn() > 0) {
        $pdo->prepare('UPDATE products SET is_active = 0 WHERE id = ?')->execute([$id]);
        flash('success', 'Product is in past orders, so it was hidden instead of deleted.');
        redirect('/admin/products');
    }
    $pdo->prepare('DELETE FROM products WHERE id = ?')->execute([$id]);
    flash('success', 'Product deleted.');
    redirect('/admin/products');
}

function handle_order_status(PDO $pdo, int $orderId): void
{
    $allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    $status = (string) ($_POST['status'] ?? '');
    if (!in_array($status, $allowed, true)) {
        flash('error', 'Unknown status.');
        redirect('/admin/orders/' . $orderId);
    }

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare('SELECT * FROM orders WHERE id = ? FOR UPDATE');
        $stmt->execute([$orderId]);
        $order = $stmt->fetch();
        if (!$order) {
            throw new RuntimeException('Order not found.');
        }
        $old = $order['status'];
        if ($old !== $status) {
            if ($status === 'cancelled' && $old !== 'cancelled') {
                $items = $pdo->prepare('SELECT product_id, qty FROM order_items WHERE order_id = ?');
                $items->execute([$orderId]);
                $up = $pdo->prepare('UPDATE products SET stock = stock + ? WHERE id = ?');
                foreach ($items as $item) {
                    $up->execute([(int) $item['qty'], (int) $item['product_id']]);
                }
            } elseif ($old === 'cancelled' && $status !== 'cancelled') {
                $items = $pdo->prepare('SELECT product_id, qty FROM order_items WHERE order_id = ?');
                $items->execute([$orderId]);
                $check = $pdo->prepare('SELECT stock, name FROM products WHERE id = ? FOR UPDATE');
                $down = $pdo->prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
                foreach ($items as $item) {
                    $check->execute([(int) $item['product_id']]);
                    $p = $check->fetch();
                    if (!$p || (int) $p['stock'] < (int) $item['qty']) {
                        throw new RuntimeException('Not enough stock to reopen this order.');
                    }
                    $down->execute([(int) $item['qty'], (int) $item['product_id']]);
                }
            }
            $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?')->execute([$status, $orderId]);
        }
        $pdo->commit();
        flash('success', 'Order status updated.');
    } catch (Throwable $e) {
        $pdo->rollBack();
        flash('error', $e->getMessage());
    }
    redirect('/admin/orders/' . $orderId);
}

function save_product_upload(array $file): ?string
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        return null;
    }
    if (($file['size'] ?? 0) > 5 * 1024 * 1024) {
        return null;
    }
    $info = @getimagesize($file['tmp_name']);
    if ($info === false) {
        return null;
    }
    $mime = $info['mime'] ?? '';
    $map = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
    ];
    if (!isset($map[$mime])) {
        return null;
    }
    $dir = APP_ROOT . '/public/uploads';
    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }
    $name = 'p' . date('YmdHis') . '-' . bin2hex(random_bytes(4)) . '.' . $map[$mime];
    $dest = $dir . '/' . $name;
    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        return null;
    }
    return 'uploads/' . $name;
}

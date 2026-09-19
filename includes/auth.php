<?php

function current_staff(): ?array
{
    return $_SESSION['staff'] ?? null;
}

function require_staff(): void
{
    if (!current_staff()) {
        flash('error', 'Please sign in to continue.');
        redirect('/admin/login');
    }
}

function staff_login(PDO $pdo, string $username, string $password): bool
{
    $stmt = $pdo->prepare('SELECT id, username, password_hash FROM staff WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $staff = $stmt->fetch();
    if (!$staff || !password_verify($password, $staff['password_hash'])) {
        return false;
    }
    $_SESSION['staff'] = [
        'id' => (int) $staff['id'],
        'username' => $staff['username'],
    ];
    session_regenerate_id(true);
    return true;
}

function staff_logout(): void
{
    unset($_SESSION['staff']);
    session_regenerate_id(true);
}

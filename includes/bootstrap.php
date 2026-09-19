<?php

declare(strict_types=1);

if (!defined('PT_ROOT')) {
    define('PT_ROOT', dirname(__DIR__));
}

$configPath = PT_ROOT . '/config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    echo 'Missing config.php. Copy config.example.php to config.php and set your MySQL credentials.';
    exit;
}

/** @var array $config */
$config = require $configPath;

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_name($config['app']['session_name'] ?? 'picktrinkets');
    session_start();
}

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/cart.php';
require_once __DIR__ . '/auth.php';

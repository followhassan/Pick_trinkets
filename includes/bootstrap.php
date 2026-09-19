<?php

define('APP_ROOT', dirname(__DIR__));

$configFile = APP_ROOT . '/config.php';
if (!is_file($configFile)) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Missing config.php. Copy config.example.php to config.php and set your database credentials.\n";
    exit;
}

$CONFIG = require $configFile;

session_name('picktrinkets');
session_start();

require APP_ROOT . '/includes/helpers.php';
require APP_ROOT . '/includes/db.php';
require APP_ROOT . '/includes/cart.php';
require APP_ROOT . '/includes/auth.php';

<?php

/**
 * Copy this file to config.php and adjust for your local MySQL.
 */

return [
    'db' => [
        'host' => '127.0.0.1',
        'port' => 3306,
        'name' => 'picktrinkets',
        'user' => 'picktrinkets',
        'pass' => 'picktrinkets',
        'charset' => 'utf8mb4',
    ],
    'app' => [
        'name' => 'Pick Trinkets',
        'tagline' => 'Cute handmade accessories',
        'location' => 'Dhaka, Bangladesh',
        'email' => 'picktrinkets@gmail.com',
        'facebook' => 'https://www.facebook.com/picktrinkets/',
        'instagram' => 'https://www.instagram.com/picktrinkets/',
        'base_url' => '', // leave empty to auto-detect; e.g. '/picktrinkets/public' on XAMPP
        'session_name' => 'picktrinkets',
    ],
];

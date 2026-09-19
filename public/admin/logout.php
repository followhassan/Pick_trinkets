<?php
require_once dirname(__DIR__, 2) . '/includes/bootstrap.php';
admin_logout();
redirect('admin/login.php');

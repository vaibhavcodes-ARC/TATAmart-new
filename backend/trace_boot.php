<?php
$start = microtime(true);
echo "Starting trace...\n";

require __DIR__.'/vendor/autoload.php';
echo "Autoloader loaded in " . (microtime(true) - $start) . "s\n";
$mark = microtime(true);

$app = require_once __DIR__.'/bootstrap/app.php';
echo "App file loaded in " . (microtime(true) - $mark) . "s\n";
$mark = microtime(true);

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
echo "Kernel resolved in " . (microtime(true) - $mark) . "s\n";
$mark = microtime(true);

$kernel->bootstrap();
echo "Kernel bootstrapped in " . (microtime(true) - $mark) . "s\n";
$mark = microtime(true);

echo "TOTAL LOAD TIME: " . (microtime(true) - $start) . "s\n";

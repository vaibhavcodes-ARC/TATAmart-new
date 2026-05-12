<?php
$start = microtime(true);
echo "Starting deep trace...\n";

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

// Reflection to get bootstrappers
$refl = new ReflectionObject($kernel);
$method = $refl->getMethod('bootstrappers');
$method->setAccessible(true);
$bootstrappers = $method->invoke($kernel);

foreach ($bootstrappers as $bootstrapper) {
    echo "Running " . $bootstrapper . "... ";
    $mark = microtime(true);
    $app->make($bootstrapper)->bootstrap($app);
    echo "DONE in " . (microtime(true) - $mark) . "s\n";
}

echo "TOTAL LOAD TIME: " . (microtime(true) - $start) . "s\n";

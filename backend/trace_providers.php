<?php
$start = microtime(true);
echo "Starting provider trace...\n";

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

// Boot up to before BootProviders
$refl = new ReflectionObject($kernel);
$method = $refl->getMethod('bootstrappers');
$method->setAccessible(true);
$bootstrappers = $method->invoke($kernel);

foreach ($bootstrappers as $bootstrapper) {
    if ($bootstrapper === 'Illuminate\Foundation\Bootstrap\BootProviders') {
        break;
    }
    $app->make($bootstrapper)->bootstrap($app);
}

// Now iterate and manually boot each provider
echo "Pre-boot complete. Booting individual providers...\n";
$providers = $app->getLoadedProviders();
foreach ($providers as $name => $isLoaded) {
    echo "Booting Provider: " . $name . "... ";
    $mark = microtime(true);
    
    // Force re-boot or call boot directly via reflection
    $providerInstance = $app->resolveProvider($name);
    if (method_exists($providerInstance, 'boot')) {
        $app->call([$providerInstance, 'boot']);
    }
    
    echo "DONE in " . (microtime(true) - $mark) . "s\n";
}

echo "ALL DONE!\n";

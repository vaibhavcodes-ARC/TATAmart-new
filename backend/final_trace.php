<?php
$start = microtime(true);
echo "Starting final trace...\n";

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

// Boot up to before BootProviders
$reflKernel = new ReflectionObject($kernel);
$method = $reflKernel->getMethod('bootstrappers');
$method->setAccessible(true);
$bootstrappers = $method->invoke($kernel);

foreach ($bootstrappers as $bootstrapper) {
    if ($bootstrapper === 'Illuminate\Foundation\Bootstrap\BootProviders') {
        break;
    }
    $app->make($bootstrapper)->bootstrap($app);
}

echo "Pre-boot complete. Running Provider boot...\n";
// Force boot on app
$reflApp = new ReflectionClass($app);
$p = $reflApp->getProperty('booted');
$p->setAccessible(true);
$p->setValue($app, false); // Prevent short-circuit if it was somehow marked true

// Run boot sequence step by step as it is in Application::boot()
$providers = $app->getLoadedProviders();
foreach (array_keys($providers) as $name) {
    $providerInstance = $app->resolveProvider($name);
    echo "--- Booting sequence for $name ---\n";
    
    echo "  > callBootingCallbacks()... ";
    $mark = microtime(true);
    $providerInstance->callBootingCallbacks();
    echo "DONE (" . (microtime(true)-$mark) . "s)\n";

    echo "  > call boot() method... ";
    $mark = microtime(true);
    if (method_exists($providerInstance, 'boot')) {
        $app->call([$providerInstance, 'boot']);
    }
    echo "DONE (" . (microtime(true)-$mark) . "s)\n";

    echo "  > callBootedCallbacks()... ";
    $mark = microtime(true);
    $providerInstance->callBootedCallbacks();
    echo "DONE (" . (microtime(true)-$mark) . "s)\n";
}

echo "Checking Booting Callbacks...\n";
$propBooting = $reflApp->getProperty('bootingCallbacks');
$propBooting->setAccessible(true);
$bootingCallbacks = $propBooting->getValue($app);
foreach ($bootingCallbacks as $i => $cb) {
    echo "Running booting callback #$i... ";
    $mark = microtime(true);
    call_user_func($cb, $app);
    echo "DONE (" . (microtime(true)-$mark) . "s)\n";
}

echo "Checking Booted Callbacks...\n";
$propBooted = $reflApp->getProperty('bootedCallbacks');
$propBooted->setAccessible(true);
$bootedCallbacks = $propBooted->getValue($app);
foreach ($bootedCallbacks as $i => $cb) {
    echo "Running booted callback #$i... ";
    $mark = microtime(true);
    call_user_func($cb, $app);
    echo "DONE (" . (microtime(true)-$mark) . "s)\n";
}

echo "ALL COMPLETE WITHOUT LOCK!\n";

<?php
$file = __DIR__.'/vendor/laravel/framework/src/Illuminate/Foundation/Application.php';
$content = file_get_contents($file);

// Inject tracer around array_walk
$search = 'array_walk($this->serviceProviders, function ($p) {';
$replace = 'echo "  [BOOT DEBUG] Entering provider loop...\n"; ' .
           'array_walk($this->serviceProviders, function ($p) { ' .
           'echo "  [BOOT DEBUG] Attempting to boot: " . get_class($p) . "\n";';
$content = str_replace($search, $replace, $content);

// Inject tracer at start and end of boot()
$search = 'public function boot()' . "\n" . '    {';
$replace = 'public function boot()' . "\n" . '    {' . "\n" . '        echo "  [BOOT DEBUG] Method boot() CALLED\n";';
$content = str_replace($search, $replace, $content);

$search = '$this->fireAppCallbacks($this->bootedCallbacks);';
$replace = 'echo "  [BOOT DEBUG] Firing bootedCallbacks...\n"; ' .
           '$this->fireAppCallbacks($this->bootedCallbacks); ' .
           'echo "  [BOOT DEBUG] Method boot() COMPLETE!\n";';
$content = str_replace($search, $replace, $content);

file_put_contents($file, $content);
echo "Patch applied successfully!\n";

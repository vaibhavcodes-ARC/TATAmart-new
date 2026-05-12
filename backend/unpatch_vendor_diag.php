<?php
$file = __DIR__.'/vendor/laravel/framework/src/Illuminate/Foundation/Application.php';
$content = file_get_contents($file);

// Reverse trace around array_walk
$search = 'echo "  [BOOT DEBUG] Entering provider loop...\n"; ' .
           'array_walk($this->serviceProviders, function ($p) { ' .
           'echo "  [BOOT DEBUG] Attempting to boot: " . get_class($p) . "\n";';
$replace = 'array_walk($this->serviceProviders, function ($p) {';
$content = str_replace($search, $replace, $content);

// Reverse trace at start of boot()
$search = 'public function boot()' . "\n" . '    {' . "\n" . '        echo "  [BOOT DEBUG] Method boot() CALLED\n";';
$replace = 'public function boot()' . "\n" . '    {';
$content = str_replace($search, $replace, $content);

// Reverse trace at end of boot()
$search = 'echo "  [BOOT DEBUG] Firing bootedCallbacks...\n"; ' .
           '$this->fireAppCallbacks($this->bootedCallbacks); ' .
           'echo "  [BOOT DEBUG] Method boot() COMPLETE!\n";';
$replace = '$this->fireAppCallbacks($this->bootedCallbacks);';
$content = str_replace($search, $replace, $content);

file_put_contents($file, $content);
echo "Rollback patch applied successfully!\n";

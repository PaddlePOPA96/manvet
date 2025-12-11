<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/debug-db', function () {
    return [
        'default_connection' => config('database.default'),
        'env_connection' => env('DB_CONNECTION'),
        'env_exists' => file_exists(base_path('.env')),
    ];
});

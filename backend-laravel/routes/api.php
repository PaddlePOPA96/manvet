<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\StockMutationController;
use App\Http\Controllers\Api\PromotionController;
use App\Http\Controllers\Api\PackageController;

// Fallback login route for Sanctum auth failure
Route::get('/login', function () {
    return response()->json(['message' => 'Unauthorized'], 401);
})->name('login');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Auth
Route::post('/auth/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/auth/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/auth/me', [AuthController::class, 'me']);

// Public routes (matching NestJS behavior if any, but stricter is better)
// Products
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
Route::post('/products/{id}/adjust', [ProductController::class, 'adjustStock']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

// Transactions
// The original GET /transactions was not protected, POST /transactions was.
// Using apiResource will protect all routes if middleware is applied to the group.
// For now, we'll apply middleware to the resource, assuming all transaction routes should be protected.
Route::middleware('auth:sanctum')->apiResource('transaksi', TransactionController::class); // Was transactions

// Stock Mutations
Route::middleware('auth:sanctum')->apiResource('mutasi-stok', StockMutationController::class); // Was stock-mutations

// Promotions
Route::get('/promotions', [PromotionController::class, 'index']);
Route::post('/promotions', [PromotionController::class, 'store']);
Route::patch('/promotions/{id}/toggle', [PromotionController::class, 'toggle']);
Route::delete('/promotions/{id}', [PromotionController::class, 'destroy']);

// Packages
Route::get('/packages', [PackageController::class, 'index']);
Route::post('/packages', [PackageController::class, 'store']);
Route::delete('/packages/{id}', [PackageController::class, 'destroy']);

// Dashboard
Route::get('/dashboard', [\App\Http\Controllers\Api\DashboardController::class, 'index']);


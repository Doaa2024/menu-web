<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::get('menu', [App\Http\Controllers\API\MenuController::class, 'index']);
Route::apiResource('restaurants', App\Http\Controllers\API\RestaurantController::class);
Route::apiResource('products', App\Http\Controllers\API\ProductController::class);
Route::apiResource('categories', App\Http\Controllers\API\CategoryController::class);
Route::apiResource('subcategories', App\Http\Controllers\API\SubcategoryController::class);
Route::post('/chat', [App\Http\Controllers\API\ChatController::class, 'chat']);
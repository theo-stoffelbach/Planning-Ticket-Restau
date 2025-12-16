<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MealEntryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Meal entries routes
    Route::get('/meal-entries', [MealEntryController::class, 'index']);
    Route::post('/meal-entries', [MealEntryController::class, 'toggle']);
    Route::post('/meal-entries/bulk', [MealEntryController::class, 'bulkUpdate']);
    Route::get('/meal-entries/stats', [MealEntryController::class, 'stats']);
});

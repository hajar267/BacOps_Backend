<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BacTypeController;
use App\Http\Controllers\RfidController;
use App\Http\Controllers\BacController;
use App\Http\Controllers\InstallController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\PVController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/refresh', [AuthController::class, 'refresh']);

Route::middleware(['auth:api', 'permission:stock:read'])->group(function () {
    Route::get('/bac-types/natures', [BacTypeController::class, 'natures']);
    Route::get('/bac-types/capacites', [BacTypeController::class, 'capacites']);
    Route::get('/bac-types/matieres', [BacTypeController::class, 'matieres']);
    Route::get('/bac-types/colors', [BacTypeController::class, 'colors']);
    Route::get('/bac-types/bac-types', [BacTypeController::class, 'index']);
});

Route::post('/bac-types/bac-types', [BacTypeController::class, 'store'])
    ->middleware(['auth:api', 'permission:stock:create']);

Route::post('/stock/rfids', [RfidController::class, 'store'])
    ->middleware(['auth:api', 'permission:stock:create']);

Route::post('/stock/bacs', [BacController::class, 'store'])
    ->middleware(['auth:api', 'permission:stock:create']);

Route::post('/installations/BacRFID_avbl', [InstallController::class, 'checkAvailability'])
    ->middleware(['auth:api', 'permission:install:read']);

Route::post('/installations/install', [InstallController::class, 'store'])
    ->middleware(['auth:api', 'permission:install:create']);

Route::middleware(['auth:api'])->group(function () {
    Route::get('/search/bac/infos', [SearchController::class, 'infos']);
    Route::get('/search/bac/{id}/history', [SearchController::class, 'history']);
    Route::get('/search/bac/location', [SearchController::class, 'locations']);
});

Route::middleware(['auth:api', 'permission:admin:read'])->group(function () {
    Route::get('/pv', [PVController::class, 'index']);
    Route::get('/pv/preview', [PVController::class, 'preview']);
});

Route::post('/pv/download', [PVController::class, 'store'])
    ->middleware(['auth:api', 'permission:admin:create']);

Route::post('/pv/{id}/signed', [PVController::class, 'uploadSigned'])
    ->middleware(['auth:api', 'permission:admin:create']);
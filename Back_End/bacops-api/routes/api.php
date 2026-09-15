<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BacController;
use App\Http\Controllers\BacTypeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InstallController;
use App\Http\Controllers\PVController;
use App\Http\Controllers\RfidController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\VilleController;
use App\Http\Controllers\PrefectureController;
use App\Http\Controllers\ArrondissementController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\CadreCommandeController;
use App\Http\Controllers\DechargeController;

// Authentication
Route::post('/auth/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');
Route::post('/auth/refresh', [AuthController::class, 'refresh'])
    ->middleware('throttle:10,1');
    Route::post('/auth/logout', [AuthController::class, 'logout'])
    ->middleware(['auth:api', 'access-token']);

// Bac types and stock
Route::middleware(['auth:api', 'access-token', 'permission:stock:read'])->group(function () {
    Route::get('/bac-types/natures', [BacTypeController::class, 'natures']);
    Route::get('/bac-types/capacites', [BacTypeController::class, 'capacites']);
    Route::get('/bac-types/matieres', [BacTypeController::class, 'matieres']);
    Route::get('/bac-types/colors', [BacTypeController::class, 'colors']);
    Route::get('/bac-types/bac-types', [BacTypeController::class, 'index']);
    Route::get('/decharges', [DechargeController::class, 'index']);
});

Route::post('/bac-types/bac-types', [BacTypeController::class, 'store'])
    ->middleware(['auth:api', 'access-token', 'permission:stock:create']);

Route::post('/stock/rfids', [RfidController::class, 'store'])
    ->middleware(['auth:api', 'access-token', 'permission:stock:create', 'throttle:10,1']);

Route::post('/stock/bacs', [BacController::class, 'store'])
    ->middleware(['auth:api', 'access-token', 'permission:stock:create', 'throttle:10,1']);

Route::middleware(['auth:api', 'access-token', 'permission:stock:read'])->group(function () {
    Route::get('/cadre-commandes', [CadreCommandeController::class, 'index']);
});

Route::post('/cadre-commandes', [CadreCommandeController::class, 'store'])
    ->middleware(['auth:api', 'access-token', 'permission:admin:create']);

// Installations
Route::post('/installations/BacRFID_avbl', [InstallController::class, 'checkAvailability'])
    ->middleware(['auth:api', 'access-token', 'permission:install:read']);

Route::post('/installations/install', [InstallController::class, 'store'])
    ->middleware(['auth:api', 'access-token', 'permission:install:create']);

// Bac search
Route::middleware(['auth:api', 'access-token'])->group(function () {
    Route::get('/search/bac/infos', [SearchController::class, 'infos']);
    Route::get('/search/bac/{id}/history', [SearchController::class, 'history']);
    Route::get('/search/bac/location', [SearchController::class, 'locations']);
});

// Dashboard
Route::middleware(['auth:api', 'access-token', 'permission:admin:read'])->group(function () {
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/installations', [DashboardController::class, 'installations']);
    Route::get('/dashboard/bacs-per-type', [DashboardController::class, 'bacsPerType']);
    Route::get('/dashboard/bac-value', [DashboardController::class, 'bacValue']);
});

// Users
Route::middleware(['auth:api', 'access-token', 'permission:admin:read'])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
});

Route::post('/users', [UserController::class, 'store'])
    ->middleware(['auth:api', 'access-token', 'permission:admin:create']);

Route::middleware(['auth:api', 'access-token', 'permission:admin:update'])->group(function () {
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::patch('/users/{user}/password', [UserController::class, 'updatePassword']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
});

// Locations
Route::middleware(['auth:api', 'access-token', 'permission:admin:read'])->group(function () {
    Route::get('/villes', [VilleController::class, 'index']);
    Route::get('/prefectures', [PrefectureController::class, 'index']);
    Route::get('/arrondissements', [ArrondissementController::class, 'index']);
    Route::get('/search/arrondissements', [ArrondissementController::class, 'search']);
});

Route::middleware(['auth:api', 'access-token', 'permission:admin:create'])->group(function () {
    Route::post('/villes', [VilleController::class, 'store']);
    Route::post('/prefectures', [PrefectureController::class, 'store']);
    Route::post('/arrondissements', [ArrondissementController::class, 'store']);
});

Route::middleware(['auth:api', 'access-token', 'permission:admin:update'])->group(function () {
    Route::put('/villes/{ville}', [VilleController::class, 'update']);
    Route::delete('/villes/{ville}', [VilleController::class, 'destroy']);
    Route::put('/prefectures/{prefecture}', [PrefectureController::class, 'update']);
    Route::delete('/prefectures/{prefecture}', [PrefectureController::class, 'destroy']);
    Route::put('/arrondissements/{arrondissement}', [ArrondissementController::class, 'update']);
    Route::delete('/arrondissements/{arrondissement}', [ArrondissementController::class, 'destroy']);
});

// Roles and permissions
Route::middleware(['auth:api', 'access-token', 'permission:admin:read'])->group(function () {
    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::get('/roles', [RoleController::class, 'index']);
});

Route::post('/roles', [RoleController::class, 'store'])
    ->middleware(['auth:api', 'access-token', 'permission:admin:create']);

Route::middleware(['auth:api', 'access-token', 'permission:admin:update'])->group(function () {
    Route::put('/roles/{role}', [RoleController::class, 'update']);
    Route::delete('/roles/{role}', [RoleController::class, 'destroy']);
});

// Suppliers
Route::middleware(['auth:api', 'access-token', 'permission:admin:read'])->group(function () {
    Route::get('/suppliers', [SupplierController::class, 'index']);
});

Route::post('/suppliers', [SupplierController::class, 'store'])
    ->middleware(['auth:api', 'access-token', 'permission:admin:create']);

Route::middleware(['auth:api', 'access-token', 'permission:admin:update'])->group(function () {
    Route::put('/suppliers/{supplier}', [SupplierController::class, 'update']);
    Route::delete('/suppliers/{supplier}', [SupplierController::class, 'destroy']);
});

// Cadre de commandes
Route::middleware(['auth:api', 'access-token', 'permission:admin:update'])->group(function () {
    Route::put('/cadre-commandes/{cadreCommande}', [CadreCommandeController::class, 'update']);
    Route::delete('/cadre-commandes/{cadreCommande}', [CadreCommandeController::class, 'destroy']);
});

// Procès-verbaux
Route::middleware(['auth:api', 'access-token', 'permission:admin:read'])->group(function () {
    Route::get('/pv', [PVController::class, 'index']);
    Route::get('/pv/preview', [PVController::class, 'preview']);
});

Route::post('/pv/download', [PVController::class, 'store'])
    ->middleware(['auth:api', 'access-token', 'permission:admin:create']);

Route::delete('/pv/{id}', [PVController::class, 'destroy'])
    ->middleware(['auth:api', 'access-token', 'permission:admin:update']);

Route::post('/pv/{id}/signed', [PVController::class, 'uploadSigned'])
    ->middleware(['auth:api', 'access-token', 'permission:admin:create']);

// Bac type deletion
Route::middleware(['auth:api', 'access-token', 'permission:admin:update'])->group(function () {
    Route::put('/bac-types/bac-types/{bacType}', [BacTypeController::class, 'update']);
    Route::delete('/bac-types/bac-types/{bacType}', [BacTypeController::class, 'destroy']);
});

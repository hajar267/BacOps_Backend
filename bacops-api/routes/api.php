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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\VilleController;
use App\Http\Controllers\PrefectureController;
use App\Http\Controllers\ArrondissementController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\CadreCommandeController;

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

Route::middleware(['auth:api', 'permission:admin:read'])->group(function () {
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/installations', [DashboardController::class, 'installations']);
    Route::get('/dashboard/bacs-per-type', [DashboardController::class, 'bacsPerType']);
    Route::get('/dashboard/bac-value', [DashboardController::class, 'bacValue']);
    Route::get('/users', [UserController::class, 'index']);
});

Route::middleware(['auth:api', 'permission:admin:update'])->group(function () {
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::patch('/users/{user}/password', [UserController::class, 'updatePassword']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
});

Route::post('/users', [UserController::class, 'store'])
    ->middleware(['auth:api', 'permission:admin:create']);

// Route::middleware(['auth:api', 'permission:admin:read'])->group(function () {
//     Route::get('/locations/tree', [LocationController::class, 'tree']);
// });

// Route::middleware(['auth:api', 'permission:admin:create'])->group(function () {
//     Route::post('/arrondissements', [LocationController::class, 'store']);
// });

// Route::middleware(['auth:api', 'permission:admin:update'])->group(function () {
//     Route::put('/arrondissements/{id}', [LocationController::class, 'update']);
//     Route::delete('/arrondissements/{id}', [LocationController::class, 'destroy']);
// });

//////////////////
Route::middleware(['auth:api', 'permission:admin:read'])->group(function () {
    Route::get('/villes', [VilleController::class, 'index']);
    Route::get('/prefectures', [PrefectureController::class, 'index']);
    Route::get('/arrondissements', [ArrondissementController::class, 'index']);
});

Route::middleware(['auth:api', 'permission:admin:create'])->group(function () {
    Route::post('/villes', [VilleController::class, 'store']);
    Route::post('/prefectures', [PrefectureController::class, 'store']);
    Route::post('/arrondissements', [ArrondissementController::class, 'store']);
});

Route::middleware(['auth:api', 'permission:admin:update'])->group(function () {
    Route::put('/villes/{ville}', [VilleController::class, 'update']);
    Route::delete('/villes/{ville}', [VilleController::class, 'destroy']);
    Route::put('/prefectures/{prefecture}', [PrefectureController::class, 'update']);
    Route::delete('/prefectures/{prefecture}', [PrefectureController::class, 'destroy']);
    Route::put('/arrondissements/{arrondissement}', [ArrondissementController::class, 'update']);
    Route::delete('/arrondissements/{arrondissement}', [ArrondissementController::class, 'destroy']);
});
//////////////////

Route::middleware(['auth:api', 'permission:admin:read'])->group(function () {
    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::get('/roles', [RoleController::class, 'index']);
});

Route::middleware(['auth:api', 'permission:admin:create'])
    ->post('/roles', [RoleController::class, 'store']);

Route::middleware(['auth:api', 'permission:admin:update'])->group(function () {
    Route::put('/roles/{role}', [RoleController::class, 'update']);
    Route::delete('/roles/{role}', [RoleController::class, 'destroy']);
});

Route::middleware(['auth:api', 'permission:admin:read'])->group(function () {
    Route::get('/suppliers', [SupplierController::class, 'index']);
});

Route::post('/suppliers', [SupplierController::class, 'store'])
    ->middleware(['auth:api', 'permission:admin:create']);


// Route::middleware('auth:api')->get('/pvs/{pv}/signed-pdf', [PVController::class, 'signedPdf'])->name('pvs.signed-pdf');

Route::middleware('auth:api')->get('/attachments/{attachment}/file', [AttachmentController::class, 'file'])->name('attachments.file');

Route::middleware(['auth:api', 'permission:stock:read'])->group(function () {
    Route::get('/cadre-commandes', [CadreCommandeController::class, 'index']);
});


// ////////testing stuff
// Route::get('/hello', function () {
//     return response()->json([
//         'message' => 'Hello from Laravel'
//     ]);
// });
// ////////

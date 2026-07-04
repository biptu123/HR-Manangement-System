<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterCompanyController;
use App\Http\Controllers\UploadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/upload/logo', [UploadController::class, 'storeLogo']);
Route::post('/register', [RegisterCompanyController::class, 'store']);
Route::post('/login', [LoginController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy']);
    
    Route::get('/user', function (Request $request) {
        return $request->user()->load('companies');
    });
});
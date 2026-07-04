<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterCompanyController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\UploadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/upload/logo', [UploadController::class, 'storeLogo']);
Route::post('/register', [RegisterCompanyController::class, 'store']);
Route::post('/login', [LoginController::class, 'store']);

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['guest', 'signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy']);
    
    Route::get('/user', function (Request $request) {
        return $request->user()->load('companies');
    });
});
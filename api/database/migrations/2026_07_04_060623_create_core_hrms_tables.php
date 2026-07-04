<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        //  Companies Table
        Schema::create('companies', function (Blueprint $table) {
            $table->ulid('id')->primary(); // 1 - walgi
            $table->string('name');
            $table->string('domain')->nullable();
            $table->string('logo_url')->nullable();
            $table->timestamps();
        });

        //  Roles Table
        Schema::create('roles', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('company_id')->constrained('companies')->cascadeOnDelete(); // 1 - Adimn 
            $table->string('name'); // e.g., 'ADMIN', 'EMPLOYEE'
            $table->json('permissions')->nullable();
            $table->timestamps();
        });

        //  Company_User Pivot Table
        Schema::create('company_user', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignUlid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUlid('role_id')->constrained('roles')->cascadeOnDelete();
            $table->timestamps();

            //! A user can only have one active role per company
            $table->unique(['company_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_user');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('companies');
    }
};
<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_company_and_admin_can_register(): void
    {
        // 1. Send the data to our custom API endpoint using postJson
        $response = $this->postJson('/api/register', [
            'company_name' => 'Acme Corp',
            'name' => 'Test Admin',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123' 
        ]);

        // 2. Assert we get a 201 Created and the correct JSON payload
        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'user' => ['id', 'name', 'email'],
                     'token',
                     'message'
                 ]);

        // 3. Verify the database actually created all the required records
        $this->assertDatabaseHas('companies', [
            'name' => 'Acme Corp'
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'Test Admin'
        ]);

        $this->assertDatabaseHas('roles', [
            'name' => 'ADMIN'
        ]);
        
        // Ensure the token was successfully generated in the database
        $this->assertDatabaseCount('personal_access_tokens', 1);
    }
}
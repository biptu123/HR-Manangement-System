<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $userCode; // Add this
    public $password;
    public $verificationUrl;

    // Update the constructor to accept the user_code string
    public function __construct($user, string $userCode, $password = null)
    {
        $this->user = $user;
        $this->userCode = $userCode;
        $this->password = $password;
        
        $this->verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $user->getKey(),
                'hash' => sha1($user->getEmailForVerification()),
            ]
        );
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Welcome! Verify Your Account Details');
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.welcome');
    }
}
<x-mail::message>
# Welcome to our platform!

Your account has been successfully created. Here are your details:

**User Code:** {{ $userCode }}

@if($password)
**Password:** {{ $password }}

> *Please keep this password secure or change it after logging in.*
@endif

Please click the button below to verify your email address.

<x-mail::button :url="$verificationUrl">
Verify Email Address
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
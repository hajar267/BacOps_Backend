<?php
// app/Services/UserService.php

namespace App\Services;

use App\Models\User;

class UserService
{
    public function getAllUsers()
    {
        return User::with('role')->orderBy('id', 'asc')->get();
    }
}
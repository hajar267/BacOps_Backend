<?php
// app/Exceptions/InstallServiceException.php

namespace App\Exceptions;

use Exception;

class InstallServiceException extends Exception
{
    protected int $statusCode;
    protected mixed $details;

    public function __construct(string $message, int $statusCode = 400, mixed $details = null)
    {
        parent::__construct($message);
        $this->statusCode = $statusCode;
        $this->details = $details;
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function getDetails(): mixed
    {
        return $this->details;
    }
}

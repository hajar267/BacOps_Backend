<?php
// app/Exceptions/StockServiceException.php

namespace App\Exceptions;

use Exception;

class StockServiceException extends Exception
{
    protected int $statusCode;
    protected ?array $conflicts;

    public function __construct(string $message, int $statusCode = 400, ?array $conflicts = null)
    {
        parent::__construct($message);
        $this->statusCode = $statusCode;
        $this->conflicts = $conflicts;
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function getConflicts(): ?array
    {
        return $this->conflicts;
    }
}
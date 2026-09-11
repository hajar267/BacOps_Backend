<?php

namespace App\Services;

use App\Models\BacHistoryEvent;
use DateTimeInterface;

class BacHistoryService
{
    public function record(
        int $bacId,
        string $action,
        ?string $previousState,
        string $newState,
        ?int $agentId = null,
        ?int $rfidId = null,
        ?int $installationId = null,
        ?DateTimeInterface $occurredAt = null,
    ): BacHistoryEvent {
        return BacHistoryEvent::create([
            'bac_id' => $bacId,
            'rfid_id' => $rfidId,
            'installation_id' => $installationId,
            'action' => $action,
            'previous_state' => $previousState,
            'new_state' => $newState,
            'agent_id' => $agentId,
            'occurred_at' => $occurredAt ?? now(),
        ]);
    }
}

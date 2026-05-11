<?php

namespace App\Services\Integrations;

interface PaymentGatewayInterface
{
    public function createPaymentIntent(float $amount, string $currency, array $metadata = []): array;
    
    public function verifyWebhook(array $payload, array $headers): bool;

    public function processRefund(string $transactionId, ?float $amount = null): bool;
}

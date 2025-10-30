# Kyro Crypto Payment Platform API Documentation

## Overview

The Kyro API allows developers to integrate cryptocurrency payment processing directly into their applications. The API supports both JWT-based authentication (for web users) and API key authentication (for server-to-server integration).

## Authentication

The API supports two authentication methods:

### 1. API Key Authentication (Recommended for developers)

API keys are the preferred method for server-to-server integration. Use API keys in the `Authorization` header:

```
Authorization: Bearer YOUR_API_KEY
```

API keys are in the format `{id}_{secret}` and can be created through the web interface or using JWT authentication.

### 2. JWT Token Authentication

JWT tokens can also be used for authentication:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## API Endpoints

Base URL: `https://your-kyro-instance.com/api`

### Payments

#### Create a Payment
- **POST** `/api/payments`
- **Authentication Required**

Request Body:
```json
{
  "wallet_id": "wallet-uuid",
  "amount": 0.1,
  "crypto_token_id": "token-uuid",
  "description": "Payment description",
  "callback_url": "https://your-callback-url.com",
  "cancel_url": "https://your-cancel-url.com",
  "payer_firstname": "John",
  "payer_lastname": "Doe",
  "payer_email": "john@example.com"
}
```

Response:
```json
{
  "id": "payment-uuid",
  "wallet_id": "wallet-uuid",
  "amount": 0.1,
  "crypto_token_id": "token-uuid",
  "description": "Payment description",
  "status": "pending",
  "payment_address": "0x...",
  "expires_at": "2023-01-01T00:00:00.000Z",
  "created_at": "2023-01-01T00:00:00.000Z"
}
```

#### Get Payment Details
- **GET** `/api/payments/{id}`
- **Authentication Required**

#### List Payments
- **GET** `/api/payments`
- **Authentication Required**

#### Update Payment
- **PUT** `/api/payments/{id}`
- **Authentication Required**

#### Cancel Payment
- **DELETE** `/api/payments/{id}`
- **Authentication Required**

#### Confirm Payment
- **POST** `/api/payments/{id}/confirm`
- **Authentication Required**

### Wallets

#### Create a Wallet
- **POST** `/api/wallets`
- **Authentication Required**

Request Body:
```json
{
  "name": "My Wallet",
  "address": "0x...",
  "network_type_id": "network-uuid"
}
```

#### Get Wallet
- **GET** `/api/wallets/{id}`
- **Authentication Required**

#### List Wallets
- **GET** `/api/wallets`
- **Authentication Required**

#### Get Wallet Balance
- **GET** `/api/wallets/{id}/balance`
- **Authentication Required**

#### Deposit to Wallet
- **POST** `/api/wallets/{id}/deposit`
- **Authentication Required**

#### Withdraw from Wallet
- **POST** `/api/wallets/{id}/withdraw`
- **Authentication Required**

### Transactions

#### Create a Transaction
- **POST** `/api/transactions`
- **Authentication Required**

#### Get Transaction
- **GET** `/api/transactions/{id}`
- **Authentication Required**

#### List Transactions
- **GET** `/api/transactions`
- **Authentication Required**

#### Get Transaction Status
- **GET** `/api/transactions/{id}/status`
- **Authentication Required**

#### Refund Transaction
- **POST** `/api/transactions/{id}/refund`
- **Authentication Required**

### API Keys Management

#### Create API Key
- **POST** `/api/auth/api-keys`
- **JWT Authentication Required**

Request Body:
```json
{
  "name": "My API Key",
  "permissions": ["read", "write"]
}
```

Response:
```json
{
  "success": true,
  "apiKey": "key-id_key-secret",
  "keyInfo": {
    "id": "key-id",
    "user_id": "user-id",
    "name": "My API Key",
    "permissions": ["read", "write"],
    "active": true,
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

#### List API Keys
- **GET** `/api/auth/api-keys`
- **JWT Authentication Required**

#### Update API Key
- **PUT** `/api/auth/api-keys/{id}`
- **JWT Authentication Required**

#### Delete/Revoke API Key
- **DELETE** `/api/auth/api-keys/{id}`
- **JWT Authentication Required**

### Webhook Endpoints

#### Receive Payment Callback
- **POST** `/api/webhooks/callback`

Your application should implement this endpoint to receive payment confirmations from Kyro when payments are confirmed.

## API Key Usage Examples

### Using curl with API Key

```bash
curl -X GET \
  https://your-kyro-instance.com/api/payments \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

```bash
curl -X POST \
  https://your-kyro-instance.com/api/payments \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_id": "wallet-uuid",
    "amount": 0.05,
    "crypto_token_id": "token-uuid",
    "description": "Test payment"
  }'
```

### Using JavaScript/Node.js with API Key

```javascript
const axios = require('axios');

const KYRO_API_BASE = 'https://your-kyro-instance.com/api';
const API_KEY = 'YOUR_API_KEY';

// Create a payment using API key
async function createPayment() {
  try {
    const response = await axios.post(
      `${KYRO_API_BASE}/payments`,
      {
        wallet_id: 'wallet-uuid',
        amount: 0.05,
        crypto_token_id: 'token-uuid',
        description: 'Test payment via API'
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Payment created:', response.data);
  } catch (error) {
    console.error('Error creating payment:', error.response.data);
  }
}

// List payments using API key
async function listPayments() {
  try {
    const response = await axios.get(
      `${KYRO_API_BASE}/payments`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );
    
    console.log('Payments:', response.data);
  } catch (error) {
    console.error('Error listing payments:', error.response.data);
  }
}
```

### Using Python with API Key

```python
import requests

KYRO_API_BASE = 'https://your-kyro-instance.com/api'
API_KEY = 'YOUR_API_KEY'

def list_payments():
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(f'{KYRO_API_BASE}/payments', headers=headers)
    return response.json()

def create_payment(wallet_id, amount, token_id, description):
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'wallet_id': wallet_id,
        'amount': amount,
        'crypto_token_id': token_id,
        'description': description
    }
    
    response = requests.post(f'{KYRO_API_BASE}/payments', json=payload, headers=headers)
    return response.json()

# Example usage
payments = list_payments()
print("Payments:", payments)

new_payment = create_payment('wallet-uuid', 0.05, 'token-uuid', 'Test payment via Python')
print("New payment:", new_payment)
```

## Error Handling

The API returns standard HTTP status codes:

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or invalid
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses include details:

```json
{
  "error": "Error message"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Exceeding rate limits will result in `429 Too Many Requests` responses.

## Security Best Practices

1. Always use HTTPS to encrypt API communication
2. Store API keys securely, never expose them in client-side code
3. Rotate API keys regularly for security
4. Use specific permissions for API keys to limit access
5. Log API requests for monitoring and debugging
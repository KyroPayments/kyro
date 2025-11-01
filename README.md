# Kyro - Crypto Payment Platform

Kyro is a crypto payment platform, designed to enable businesses to accept cryptocurrency payments easily and securely.

The platform is built with the following technologies:

- Node.js
- Express.js
- Supabase
- Web3.js

The web app repository is available [here](https://github.com/KyroPayments/kyroweb).

## Features

- Payment creation and processing
- Wallet management
- Webhook notifications
- Security features

## Architecture Overview

The Kyro platform is built with the following architecture:

```
src/
├── controllers/     # Request handlers
├── models/          # Data models
├── routes/          # API route definitions
├── services/        # Business logic
├── utils/           # Utility functions
├── validators/      # Request validation
├── config/          # Configuration files
└── tests/           # Test files
```

### Core Modules

1. **Payment Module** - Handles payment creation, processing, and management
2. **Wallet Module** - Manages cryptocurrency wallets for users
3. **Webhook Module** - Handles external notifications and events
4. **Security Module** - Provides authentication and encryption

### API Endpoints

#### Payments
- `POST /api/payments` - Create a new payment
- `GET /api/payments/:id` - Retrieve payment by ID
- `PUT /api/payments/:id` - Update a payment
- `DELETE /api/payments/:id` - Cancel a payment
- `POST /api/payments/:id/confirm` - Confirm a payment

#### Wallets
- `POST /api/wallets` - Create a new wallet
- `GET /api/wallets/:id` - Retrieve wallet by ID
- `GET /api/wallets/:id/balance` - Get wallet balance
- `POST /api/wallets/:id/deposit` - Deposit funds
- `POST /api/wallets/:id/withdraw` - Withdraw funds
- `POST /api/wallets/:id/generate-address` - Generate new address

## Database Configuration

Kyro now uses Supabase (PostgreSQL) as its database engine. The configuration requires the following environment variables:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Setting up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and API keys from the dashboard
3. Update your `.env` file with the Supabase configuration

### Database Migrations

After setting up your Supabase project, run the following SQL scripts to create the required tables:

- `supabase/tables.sql` - Creates all required tables (wallets, payments)
- `supabase/policies.sql` - Sets up Row Level Security (RLS) policies

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
LOG_LEVEL=info
JWT_SECRET=your_jwt_secret
SALT_ROUNDS=12
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your environment variables

3. Set up your Supabase database using the SQL scripts in the `supabase/` directory

4. Start the development server:
```bash
npm run dev
```

5. The server will be running at `http://localhost:3000`

## Running Migrations

To run the database migrations (note: this is currently a manual process via the Supabase dashboard):

```bash
node migrate.js
```

Note: This script serves as a guide. For actual SQL execution, run the scripts in your Supabase dashboard or using the Supabase CLI.

## Testing

Run the test suite:
```bash
npm test
```

## Future Enhancements

- Integration for cross-chain payments
- Advanced fraud detection
- Multi-sig wallet support
- Compliance and KYC integration
- Mobile SDKs

## Security

Kyro implements several security measures:
- Request signing and verification
- Rate limiting
- Input validation
- Encrypted storage for sensitive data
- Secure communication protocols
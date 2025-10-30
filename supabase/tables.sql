-- Network Types table (created first to support foreign keys)
CREATE TABLE IF NOT EXISTS network_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (created first to support foreign keys)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    workspace VARCHAR(255) NOT NULL DEFAULT 'testnet',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash TEXT NOT NULL,
    permissions JSONB DEFAULT '["read", "write"]', -- JSON array of permissions
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Original Kyro tables (from previous setup)
-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id), -- Link to users table
    name VARCHAR(255) NOT NULL, -- User-defined name for the wallet
    address VARCHAR(255) UNIQUE NOT NULL, -- User-provided wallet address
    network_type_id UUID NOT NULL REFERENCES network_types(id),
    balance DECIMAL(30, 18) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blockchain Networks table - networks associated with network types
CREATE TABLE IF NOT EXISTS blockchain_networks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    network_type_id UUID NOT NULL REFERENCES network_types(id),
    symbol VARCHAR(10) NOT NULL, -- e.g., ETH, BSC, MATIC
    rpc_url TEXT,
    chain_id INTEGER,
    workspace VARCHAR(255) NOT NULL DEFAULT 'testnet',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cryptocurrency Tokens table - tokens available on each blockchain network
CREATE TABLE IF NOT EXISTS crypto_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL, -- e.g., ETH, USDT, USDC
    blockchain_network_id UUID NOT NULL REFERENCES blockchain_networks(id),
    decimals INTEGER DEFAULT 18,
    contract_address VARCHAR(255), -- For tokens, null for native coins
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_id UUID REFERENCES wallets(id),
    user_id UUID REFERENCES users(id), -- Link to users table
    amount DECIMAL(20, 8) NOT NULL,
    crypto_token_id UUID NOT NULL REFERENCES crypto_tokens(id), -- Reference to crypto token instead of currency text
    description TEXT, -- Description of the payment
    status VARCHAR(20) DEFAULT 'pending',
    payment_address VARCHAR(255),
    transaction_hash VARCHAR(255) UNIQUE,
    payer_firstname VARCHAR(255),
    payer_lastname VARCHAR(255),
    payer_email VARCHAR(255),
    payer_phone VARCHAR(255),
    payer_address VARCHAR(255),
    payer_city VARCHAR(255),
    payer_state VARCHAR(255),
    payer_zip VARCHAR(255),
    payer_country VARCHAR(255),
    workspace VARCHAR(255) NOT NULL DEFAULT 'testnet',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id), -- Link to users table
    wallet_id UUID REFERENCES wallets(id),
    payment_id UUID REFERENCES payments(id),
    amount DECIMAL(20, 8) NOT NULL,
    crypto_token_id UUID NOT NULL REFERENCES crypto_tokens(id), -- Reference to crypto token instead of currency text
    type VARCHAR(20) NOT NULL, -- 'inbound', 'outbound', 'payment', etc.
    status VARCHAR(20) DEFAULT 'pending',
    block_number INTEGER,
    from_address VARCHAR(255),
    to_address VARCHAR(255),
    workspace VARCHAR(255) NOT NULL DEFAULT 'testnet',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(active);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_network_type_id ON wallets(network_type_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_wallet_id ON payments(wallet_id);
CREATE INDEX IF NOT EXISTS idx_payments_crypto_token_id ON payments(crypto_token_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_hash ON payments(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_id ON transactions(payment_id);
CREATE INDEX IF NOT EXISTS idx_transactions_crypto_token_id ON transactions(crypto_token_id);

-- Update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at 
    BEFORE UPDATE ON api_keys 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at 
    BEFORE UPDATE ON wallets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default network type
INSERT INTO network_types (name, description) VALUES ('EVM', 'Ethereum Virtual Machine compatible networks') ON CONFLICT (name) DO NOTHING;
-- Supabase Tables for Kyro Crypto Payment Platform

-- Extension for automatic timestamp updates
CREATE EXTENSION IF NOT EXISTS moddatetime;

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    balance DECIMAL(20, 8) DEFAULT 0.00000000,
    crypto_type TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for wallets
CREATE INDEX IF NOT EXISTS wallets_user_id_idx ON wallets(user_id);
CREATE INDEX IF NOT EXISTS wallets_crypto_type_idx ON wallets(crypto_type);

-- Wallet addresses table
CREATE TABLE IF NOT EXISTS wallet_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    address TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for wallet addresses
CREATE INDEX IF NOT EXISTS wallet_addresses_wallet_id_idx ON wallet_addresses(wallet_id);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    amount DECIMAL(20, 8) NOT NULL,
    currency TEXT NOT NULL,
    wallet_id UUID REFERENCES wallets(id),
    merchant_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'failed', 'cancelled', 'refunded')),
    transaction_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for payments
CREATE INDEX IF NOT EXISTS payments_wallet_id_idx ON payments(wallet_id);
CREATE INDEX IF NOT EXISTS payments_merchant_id_idx ON payments(merchant_id);
CREATE INDEX IF NOT EXISTS payments_status_idx ON payments(status);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_wallet UUID REFERENCES wallets(id),
    to_wallet UUID REFERENCES wallets(id),
    amount DECIMAL(20, 8) NOT NULL,
    currency TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    fee DECIMAL(20, 8) DEFAULT 0.00000000,
    tx_hash TEXT,
    block_number BIGINT,
    confirmations INTEGER DEFAULT 0,
    type TEXT DEFAULT 'transfer' CHECK (type IN ('transfer', 'payment', 'refund', 'deposit', 'withdrawal')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for transactions
CREATE INDEX IF NOT EXISTS transactions_from_wallet_idx ON transactions(from_wallet);
CREATE INDEX IF NOT EXISTS transactions_to_wallet_idx ON transactions(to_wallet);
CREATE INDEX IF NOT EXISTS transactions_status_idx ON transactions(status);
CREATE INDEX IF NOT EXISTS transactions_tx_hash_idx ON transactions(tx_hash);

-- Triggers to update updated_at timestamp for all tables
CREATE TRIGGER update_wallets_updated_at 
    BEFORE UPDATE ON wallets 
    FOR EACH ROW 
    EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION moddatetime(updated_at);

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW 
    EXECUTE FUNCTION moddatetime(updated_at);
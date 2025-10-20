require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  cryptoNetworks: {
    supported: process.env.SUPPORTED_NETWORKS?.split(',') || ['ethereum', 'polygon', 'binance'],
    default: process.env.DEFAULT_NETWORK || 'ethereum'
  },
  api: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    },
    secretKey: process.env.KYRO_SECRET_KEY || 'sk_test_kyro_default_secret_key',
    publicKey: process.env.KYRO_PUBLIC_KEY || 'pk_test_kyro_default_public_key'
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'kyro',
    user: process.env.DB_USER || 'kyro_user',
    password: process.env.DB_PASSWORD || 'kyro_password'
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'kyro_jwt_secret_default',
    encryptionKey: process.env.ENCRYPTION_KEY || 'kyro_encryption_key_default',
    saltRounds: parseInt(process.env.SALT_ROUNDS) || 12
  }
};

module.exports = config;
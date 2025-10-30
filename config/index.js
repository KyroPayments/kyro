require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || 'development',
  api: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    },
    //secretKey: process.env.KYRO_SECRET_KEY || 'sk_test_kyro_default_secret_key',
    //publicKey: process.env.KYRO_PUBLIC_KEY || 'pk_test_kyro_default_public_key'
  },
  database: {
    supabase: {
      url: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
      key: process.env.SUPABASE_ANON_KEY || 'your-anon-key',
      service_role_key: process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'
    }
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
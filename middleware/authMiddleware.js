const ApiKey = require('../models/ApiKey');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

// Middleware to authenticate with JWT token (for user sessions)
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, config.security.jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to authenticate with API key
const authenticateApiKey = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'API key required in Bearer format' });
  }
  
  const fullApiKey = authHeader.substring(7); // Remove 'Bearer ' prefix
  const apiKeyParts = fullApiKey.split('_');
  
  if (apiKeyParts.length < 2) {
    return res.status(401).json({ error: 'Invalid API key format' });
  }
  
  const apiKeyId = apiKeyParts[0];
  const apiKeySecret = apiKeyParts.slice(1).join('_'); // Rejoin in case the secret itself has underscores

  try {
    // Get the API key record from database
    const apiKey = await ApiKey.findById(apiKeyId);
    if (!apiKey) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Get the stored hash for verification
    const { data: apiKeyData } = await require('@supabase/supabase-js').createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    .from('api_keys')
    .select('key_hash')
    .eq('id', apiKeyId)
    .single();

    if (!apiKeyData) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Verify the secret part of the API key
    const bcrypt = require('bcryptjs');
    const isValid = await bcrypt.compare(apiKeySecret, apiKeyData.key_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Check if API key is active
    if (!apiKey.active) {
      return res.status(401).json({ error: 'API key is inactive' });
    }

    // Add user ID and API key info to request
    req.userId = apiKey.user_id;
    req.apiKeyId = apiKey.id;
    req.apiKeyPermissions = apiKey.permissions;
    
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Authentication error' });
  }
};

// Middleware that accepts either JWT token or API key
const authenticateEither = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check if it's a Bearer token (either JWT or API key)
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // Try to determine if it's a JWT or API key by trying to decode it
    try {
      // If it's a JWT, it will decode successfully
      jwt.verify(token, config.security.jwtSecret);
      // If we reach here, it's a JWT
      return authenticateToken(req, res, next);
    } catch (jwtError) {
      // It might be an API key, try API key authentication
      return authenticateApiKey(req, res, next);
    }
  } else {
    return res.status(401).json({ error: 'Invalid authentication format' });
  }
};

module.exports = {
  authenticateToken,
  authenticateApiKey,
  authenticateEither
};
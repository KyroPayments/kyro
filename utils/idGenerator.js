const crypto = require('crypto');

// Generate unique ID with prefix
const generateId = (prefix) => {
  // Create a unique identifier using timestamp and random bytes
  const timestamp = Date.now().toString(36);
  const randomBytes = crypto.randomBytes(9).toString('hex').substring(0, 9);
  
  // Combine prefix, timestamp, and random part
  return `${prefix}_${timestamp}${randomBytes}`;
};

// Validate ID format
const validateId = (id, prefix) => {
  if (!id || typeof id !== 'string') return false;
  return id.startsWith(`${prefix}_`);
};

module.exports = {
  generateId,
  validateId
};
const crypto = require('crypto');
const config = require('../config');

// Verify webhook signature
const verifyWebhookSignature = (req) => {
  const signature = req.headers['x-kyro-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!signature) {
    return false;
  }
  
  // Create expected signature using the secret key
  const expectedSignature = crypto
    .createHmac('sha256', config.security.jwtSecret)
    .update(payload)
    .digest('hex');
  
  // Compare signatures
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
};

// Create webhook signature for outgoing webhooks
const createWebhookSignature = (payload, secret) => {
  return crypto
    .createHmac('sha256', secret || config.security.jwtSecret)
    .update(JSON.stringify(payload))
    .digest('hex');
};

// Send webhook to a URL
const sendWebhook = async (url, payload, secret) => {
  try {
    const signature = createWebhookSignature(payload, secret);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kyro-Signature': signature
      },
      body: JSON.stringify(payload)
    });
    
    return {
      success: response.ok,
      status: response.status,
      data: await response.json()
    };
  } catch (error) {
    console.error('Error sending webhook:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  verifyWebhookSignature,
  createWebhookSignature,
  sendWebhook
};
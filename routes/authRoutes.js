const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const apiKeyController = require('../controllers/apiKeyController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Profile routes (require authentication)
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);

// API key routes (require authentication)
router.get('/api-keys', authenticateToken, apiKeyController.getApiKeys);
router.post('/api-keys', authenticateToken, apiKeyController.createApiKey);
router.put('/api-keys/:id', authenticateToken, apiKeyController.updateApiKey);
router.delete('/api-keys/:id', authenticateToken, apiKeyController.deleteApiKey);

module.exports = router;
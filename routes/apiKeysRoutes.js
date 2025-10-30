const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: API Keys
 *   description: API key management
 */

/**
 * @swagger
 * /api/auth/api-keys:
 *   get:
 *     summary: Get all API keys for user
 *     tags: [API Keys]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of API keys
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 apiKeys:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ApiKey'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/api-keys:
 *   post:
 *     summary: Create a new API key
 *     tags: [API Keys]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: API key name
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: API key permissions
 *                 default: ["read", "write"]
 *     responses:
 *       201:
 *         description: API key created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 apiKey:
 *                   type: string
 *                   description: The new API key (format is id_secret)
 *                 keyInfo:
 *                   $ref: '#/components/schemas/ApiKey'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/auth/api-keys/{id}:
 *   put:
 *     summary: Update an API key
 *     tags: [API Keys]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: API key ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: API key name
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: API key permissions
 *     responses:
 *       200:
 *         description: API key updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 keyInfo:
 *                   $ref: '#/components/schemas/ApiKey'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: API key not found
 */

/**
 * @swagger
 * /api/auth/api-keys/{id}:
 *   delete:
 *     summary: Delete/revoke an API key
 *     tags: [API Keys]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: API key ID
 *     responses:
 *       200:
 *         description: API key revoked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Success status
 *                 message:
 *                   type: string
 *                   description: Success message
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: API key not found
 */

// API key routes (require JWT authentication)
router.get('/', authenticateToken, apiKeyController.getApiKeys);
router.post('/', authenticateToken, apiKeyController.createApiKey);
router.put('/:id', authenticateToken, apiKeyController.updateApiKey);
router.delete('/:id', authenticateToken, apiKeyController.deleteApiKey);

module.exports = router;
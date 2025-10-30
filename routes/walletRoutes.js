const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { authenticateEither } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Wallets
 *   description: Wallet management
 */

/**
 * @swagger
 * /api/wallets:
 *   post:
 *     summary: Create a new wallet
 *     tags: [Wallets]
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
 *                 description: Wallet name
 *               address:
 *                 type: string
 *                 description: Wallet address
 *               network_type_id:
 *                 type: string
 *                 description: Network type ID
 *     responses:
 *       201:
 *         description: Wallet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateEither, walletController.createWallet);

/**
 * @swagger
 * /api/wallets/{id}:
 *   get:
 *     summary: Get wallet by ID
 *     tags: [Wallets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Wallet ID
 *     responses:
 *       200:
 *         description: Wallet details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 */
router.get('/:id', authenticateEither, walletController.getWallet);

/**
 * @swagger
 * /api/wallets/{id}/balance:
 *   get:
 *     summary: Get wallet balance
 *     tags: [Wallets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Wallet ID
 *     responses:
 *       200:
 *         description: Wallet balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   description: Current wallet balance
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 */
router.get('/:id/balance', authenticateEither, walletController.getBalance);

/**
 * @swagger
 * /api/wallets/{id}/balance-details:
 *   get:
 *     summary: Get wallet balance details (based on confirmed payments)
 *     tags: [Wallets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Wallet ID
 *     responses:
 *       200:
 *         description: Wallet balance details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   description: Current wallet balance
 *                 available_balance:
 *                   type: number
 *                   description: Available balance (excluding pending payments)
 *                 pending_balance:
 *                   type: number
 *                   description: Pending balance from unconfirmed payments
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 */
router.get('/:id/balance-details', authenticateEither, walletController.getBalanceDetails);

/**
 * @swagger
 * /api/wallets/{id}/deposit:
 *   post:
 *     summary: Add funds to wallet
 *     tags: [Wallets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Wallet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to deposit
 *               transaction_hash:
 *                 type: string
 *                 description: Transaction hash
 *     responses:
 *       200:
 *         description: Funds added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 new_balance:
 *                   type: number
 *                   description: New wallet balance
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 */
router.post('/:id/deposit', authenticateEither, walletController.depositFunds);

/**
 * @swagger
 * /api/wallets/{id}/withdraw:
 *   post:
 *     summary: Withdraw funds from wallet
 *     tags: [Wallets]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Wallet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to withdraw
 *               to_address:
 *                 type: string
 *                 description: Address to send funds to
 *     responses:
 *       200:
 *         description: Funds withdrawn successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 new_balance:
 *                   type: number
 *                   description: New wallet balance
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 */
router.post('/:id/withdraw', authenticateEither, walletController.withdrawFunds);

/**
 * @swagger
 * /api/wallets:
 *   get:
 *     summary: List wallets
 *     tags: [Wallets]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of wallets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateEither, walletController.listWallets);

module.exports = router;
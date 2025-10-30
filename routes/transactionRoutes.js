const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateEither } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               wallet_id:
 *                 type: string
 *                 description: Wallet ID
 *               payment_id:
 *                 type: string
 *                 description: Payment ID
 *               amount:
 *                 type: number
 *                 description: Transaction amount
 *               crypto_token_id:
 *                 type: string
 *                 description: Crypto token ID
 *               type:
 *                 type: string
 *                 description: Transaction type (inbound, outbound, payment)
 *               from_address:
 *                 type: string
 *                 description: Sender address
 *               to_address:
 *                 type: string
 *                 description: Receiver address
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateEither, transactionController.createTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.get('/:id', authenticateEither, transactionController.getTransaction);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: List transactions
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateEither, transactionController.listTransactions);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update transaction status
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Transaction status
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.put('/:id', authenticateEither, transactionController.updateTransaction);

/**
 * @swagger
 * /api/transactions/{id}/status:
 *   get:
 *     summary: Get transaction status
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Current transaction status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.get('/:id/status', authenticateEither, transactionController.getTransactionStatus);

/**
 * @swagger
 * /api/transactions/{id}/refund:
 *   post:
 *     summary: Refund transaction
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction refunded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */
router.post('/:id/refund', authenticateEither, transactionController.refundTransaction);

module.exports = router;
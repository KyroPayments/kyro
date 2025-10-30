const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateEither } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
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
 *                 description: ID of the wallet
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *               crypto_token_id:
 *                 type: string
 *                 description: ID of the crypto token
 *               description:
 *                 type: string
 *                 description: Payment description
 *               callback_url:
 *                 type: string
 *                 description: Callback URL for payment confirmation
 *               cancel_url:
 *                 type: string
 *                 description: Cancel URL for payment cancellation
 *               payer_firstname:
 *                 type: string
 *                 description: Payer first name
 *               payer_lastname:
 *                 type: string
 *                 description: Payer last name
 *               payer_email:
 *                 type: string
 *                 description: Payer email
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateEither, paymentController.createPayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
router.get('/:id', authenticateEither, paymentController.getPayment);

/**
 * @swagger
 * /api/payments/public/{id}:
 *   get:
 *     summary: Get payment by ID for public payment page
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       404:
 *         description: Payment not found
 */
router.get('/public/:id', paymentController.getPaymentPublic);

/**
 * @swagger
 * /api/payments/public/{id}/confirm:
 *   post:
 *     summary: Confirm payment (public endpoint)
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *       404:
 *         description: Payment not found
 */
router.post('/public/:id/confirm', paymentController.confirmPaymentPublic);

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Update payment
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Payment description
 *               status:
 *                 type: string
 *                 description: Payment status
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
router.put('/:id', authenticateEither, paymentController.updatePayment);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: List payments
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateEither, paymentController.listPayments);

/**
 * @swagger
 * /api/payments/{id}:
 *   delete:
 *     summary: Cancel payment
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment cancelled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
router.delete('/:id', authenticateEither, paymentController.cancelPayment);

/**
 * @swagger
 * /api/payments/{id}/confirm:
 *   post:
 *     summary: Process payment confirmation
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 */
router.post('/:id/confirm', authenticateEither, paymentController.confirmPayment);

module.exports = router;
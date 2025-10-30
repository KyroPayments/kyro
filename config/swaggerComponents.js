/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - wallet_id
 *         - amount
 *         - crypto_token_id
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated payment ID
 *         wallet_id:
 *           type: string
 *           description: ID of the wallet associated with the payment
 *         user_id:
 *           type: string
 *           description: ID of the user who created the payment
 *         amount:
 *           type: number
 *           description: Payment amount
 *         crypto_token_id:
 *           type: string
 *           description: ID of the crypto token used for payment
 *         description:
 *           type: string
 *           description: Payment description
 *         status:
 *           type: string
 *           description: Payment status (pending, confirmed, cancelled)
 *           default: pending
 *         payment_address:
 *           type: string
 *           description: Address to which payment should be sent
 *         transaction_hash:
 *           type: string
 *           description: Transaction hash after payment is made
 *         payer_firstname:
 *           type: string
 *           description: Payer first name
 *         payer_lastname:
 *           type: string
 *           description: Payer last name
 *         payer_email:
 *           type: string
 *           description: Payer email
 *         payer_phone:
 *           type: string
 *           description: Payer phone number
 *         payer_address:
 *           type: string
 *           description: Payer address
 *         payer_city:
 *           type: string
 *           description: Payer city
 *         payer_state:
 *           type: string
 *           description: Payer state
 *         payer_zip:
 *           type: string
 *           description: Payer zip code
 *         payer_country:
 *           type: string
 *           description: Payer country
 *         callback_url:
 *           type: string
 *           description: Callback URL for payment confirmation
 *         cancel_url:
 *           type: string
 *           description: Cancel URL for payment cancellation
 *         workspace:
 *           type: string
 *           description: Workspace identifier
 *           default: testnet
 *         expires_at:
 *           type: string
 *           format: date-time
 *           description: Payment expiration time
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Payment creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Payment last update timestamp
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174000
 *         wallet_id: 123e4567-e89b-12d3-a456-426614174001
 *         user_id: 123e4567-e89b-12d3-a456-426614174002
 *         amount: 0.5
 *         crypto_token_id: 123e4567-e89b-12d3-a456-426614174003
 *         description: Payment for services
 *         status: pending
 *         payment_address: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
 *         payer_firstname: John
 *         payer_lastname: Doe
 *         payer_email: john.doe@example.com
 *         callback_url: https://example.com/callback
 *         cancel_url: https://example.com/cancel
 *         workspace: testnet
 *         created_at: 2023-01-01T00:00:00.000Z
 *         updated_at: 2023-01-01T00:00:00.000Z
 * 
 *     Wallet:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - network_type_id
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated wallet ID
 *         user_id:
 *           type: string
 *           description: ID of the user who owns the wallet
 *         name:
 *           type: string
 *           description: User-defined name for the wallet
 *         address:
 *           type: string
 *           description: Wallet address
 *         network_type_id:
 *           type: string
 *           description: ID of the network type
 *         balance:
 *           type: number
 *           description: Wallet balance
 *           default: 0
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Wallet creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Wallet last update timestamp
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174001
 *         user_id: 123e4567-e89b-12d3-a456-426614174002
 *         name: My Wallet
 *         address: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
 *         network_type_id: 123e4567-e89b-12d3-a456-426614174003
 *         balance: 1.5
 *         created_at: 2023-01-01T00:00:00.000Z
 *         updated_at: 2023-01-01T00:00:00.000Z
 * 
 *     Transaction:
 *       type: object
 *       required:
 *         - amount
 *         - crypto_token_id
 *         - type
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated transaction ID
 *         user_id:
 *           type: string
 *           description: ID of the user associated with the transaction
 *         wallet_id:
 *           type: string
 *           description: ID of the wallet involved in the transaction
 *         payment_id:
 *           type: string
 *           description: ID of the payment associated with the transaction
 *         amount:
 *           type: number
 *           description: Transaction amount
 *         crypto_token_id:
 *           type: string
 *           description: ID of the crypto token used in transaction
 *         type:
 *           type: string
 *           description: Transaction type (inbound, outbound, payment)
 *         status:
 *           type: string
 *           description: Transaction status
 *           default: pending
 *         block_number:
 *           type: integer
 *           description: Block number of the transaction
 *         from_address:
 *           type: string
 *           description: Sender address
 *         to_address:
 *           type: string
 *           description: Receiver address
 *         workspace:
 *           type: string
 *           description: Workspace identifier
 *           default: testnet
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Transaction creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Transaction last update timestamp
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174004
 *         user_id: 123e4567-e89b-12d3-a456-426614174002
 *         wallet_id: 123e4567-e89b-12d3-a456-426614174001
 *         payment_id: 123e4567-e89b-12d3-a456-426614174000
 *         amount: 0.5
 *         crypto_token_id: 123e4567-e89b-12d3-a456-426614174003
 *         type: inbound
 *         status: confirmed
 *         from_address: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
 *         to_address: 0x3f5CE5FBFe3E9af3971dD833D26bA9b5C632255c
 *         workspace: testnet
 *         created_at: 2023-01-01T00:00:00.000Z
 *         updated_at: 2023-01-01T00:00:00.000Z
 * 
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - name
 *         - password_hash
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated user ID
 *         email:
 *           type: string
 *           description: User email address
 *         name:
 *           type: string
 *           description: User name
 *         workspace:
 *           type: string
 *           description: User workspace
 *           default: testnet
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: User creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: User last update timestamp
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174002
 *         email: user@example.com
 *         name: John Doe
 *         workspace: testnet
 *         created_at: 2023-01-01T00:00:00.000Z
 *         updated_at: 2023-01-01T00:00:00.000Z
 * 
 *     ApiKey:
 *       type: object
 *       required:
 *         - user_id
 *         - name
 *         - key_hash
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated API key ID
 *         user_id:
 *           type: string
 *           description: ID of the user who owns the API key
 *         name:
 *           type: string
 *           description: API key name
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           description: API key permissions
 *           default: ["read", "write"]
 *         active:
 *           type: boolean
 *           description: API key status
 *           default: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: API key creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: API key last update timestamp
 *       example:
 *         id: 123e4567-e89b-12d3-a456-426614174005
 *         user_id: 123e4567-e89b-12d3-a456-426614174002
 *         name: My API Key
 *         permissions: ["read", "write"]
 *         active: true
 *         created_at: 2023-01-01T00:00:00.000Z
 *         updated_at: 2023-01-01T00:00:00.000Z
 */
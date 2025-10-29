const paymentService = require('../services/paymentService');
const { validatePayment } = require('../validators/paymentValidator');
const { handleAsyncError } = require('../utils/errorHandler');
const User = require('../models/User');

// Create a new payment
const createPayment = handleAsyncError(async (req, res) => {
  const { error, value } = validatePayment(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Use the authenticated user ID as the merchant ID if not provided in the request
  const paymentData = {
    ...value,
    user_id: value.merchant_id || req.userId
  };

  const payment = await paymentService.createPayment(paymentData, req.userId, req.userWorkspace);
  res.status(201).json({ success: true, payment });
});

// Get payment by ID
const getPayment = handleAsyncError(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  
  // Verify that the authenticated user owns this payment
  if (payment.user_id !== req.userId) {
    return res.status(403).json({ error: 'Unauthorized: You do not own this payment' });
  }
  
  res.status(200).json({ success: true, payment });
});

// Get payment by ID for public access (no authentication required)
const getPaymentPublic = handleAsyncError(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  res.status(200).json({ success: true, payment });
});

// Update payment
const updatePayment = handleAsyncError(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  
  // Verify that the authenticated user owns this payment
  if (payment.user_id !== req.userId) {
    return res.status(403).json({ error: 'Unauthorized: You do not own this payment' });
  }
  
  const updatedPayment = await paymentService.updatePayment(req.params.id, req.body);
  res.status(200).json({ success: true, payment: updatedPayment });
});

// List payments
const listPayments = handleAsyncError(async (req, res) => {
  const { page = 1, limit = 10, status, walletId } = req.query;
  const filters = { status, walletId };
  const user = await User.findById(req.userId);
  const workspace = user?.workspace || 'testnet';
  const result = await paymentService.listPayments(page, limit, filters, workspace, req.userId);
  res.status(200).json({ success: true, ...result });
});

// Cancel payment
const cancelPayment = handleAsyncError(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  
  // Verify that the authenticated user owns this payment
  if (payment.user_id !== req.userId) {
    return res.status(403).json({ error: 'Unauthorized: You do not own this payment' });
  }
  
  const cancelledPayment = await paymentService.cancelPayment(req.params.id);
  res.status(200).json({ success: true, payment: cancelledPayment });
});

// Confirm payment
const confirmPayment = handleAsyncError(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });  
  }
  
  // Verify that the authenticated user owns this payment
  if (payment.user_id !== req.userId) {
    return res.status(403).json({ error: 'Unauthorized: You do not own this payment' });
  }
  
  const confirmedPayment = await paymentService.confirmPayment(req.params.id);
  res.status(200).json({ success: true, payment: confirmedPayment });
});

// Confirm payment (public endpoint)
const confirmPaymentPublic = handleAsyncError(async (req, res) => {
  const { walletAddress, txHash } = req.body;
  
  if (!walletAddress || !txHash) {
    return res.status(400).json({ error: 'Wallet address and transaction hash are required' });
  }

  // Get the payment to validate the transaction against
  const payment = await paymentService.getPaymentById(req.params.id);
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }

  // Only allow confirmation for pending payments
  if (payment.status !== 'pending') {
    return res.status(400).json({ error: `Payment cannot be confirmed. Current status: ${payment.status}` });
  }

  // Get blockchain network info to connect to the appropriate network
  const { data: network, error: networkError } = await require('../utils/db/client').supabase
    .from('blockchain_networks')
    .select('*')
    .eq('id', payment.crypto_token.blockchain_network_id)
    .single();

  if (networkError) {
    return res.status(500).json({ error: `Error retrieving blockchain network: ${networkError.message}` });
  }

  // Initialize Web3 with the network's RPC URL
  const Web3 = require('web3');
  const web3 = new Web3.Web3(network.rpc_url);

  try {
    // Get transaction details from blockchain
    const transaction = await web3.eth.getTransaction(txHash);
    
    if (!transaction) {
      return res.status(400).json({ error: 'Transaction not found on blockchain' });
    }

    // Verify that the transaction sender matches the provided wallet address
    if (transaction.from.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(400).json({ error: 'Transaction sender does not match provided wallet address' });
    }

    // Check if the transaction has been confirmed on the blockchain
    if (!transaction.blockHash || transaction.blockHash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return res.status(400).json({ error: 'Transaction has not been confirmed on the blockchain' });
    }
    

    // Get transaction receipt to verify it was successful
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    if (!receipt) {
      return res.status(400).json({ error: 'Could not retrieve transaction receipt' });
    }

    if (receipt.status === false) {
      return res.status(400).json({ error: 'Transaction failed on the blockchain' });
    }
    

    // Get the wallet associated with this payment to compare recipient
    const wallet = await require('../models/Wallet').findById(payment.wallet_id);
    if (!wallet) {
      return res.status(404).json({ error: 'Payment wallet not found' });
    }
    

    // Check if this is a native token or ERC20 token
    const isNativeToken = !payment.crypto_token.contract_address; // If no contract address, it's a native token
    
    if (isNativeToken) {
      // For native tokens (ETH, BNB, etc.), verify the recipient and amount directly
      if (transaction.to.toLowerCase() !== wallet.address.toLowerCase()) {
        return res.status(400).json({ error: 'Transaction recipient does not match payment wallet address' });
      }
      

      // Calculate expected amount in wei (smallest unit for the token)
      let decimals = payment.crypto_token.decimals || 18;
      const expectedAmount = BigInt(Math.floor(payment.amount * (10 ** Number(decimals))));
      //const expectedAmount = web3.utils.toWei(payment.amount.toString(), 'ether');
      const transactionAmount = BigInt(transaction.value);

      // Compare amounts
      if (transactionAmount !== expectedAmount) {
        return res.status(400).json({ error: `Transaction amount does not match payment amount. Expected: ${payment.amount}, Got: ${web3.utils.fromWei(transactionAmount, 'ether')}` });
      }
    } else {
      // For ERC20 tokens, verify using transaction logs (events)
      // The payment wallet should be the recipient in the Transfer event
      //console.log(receipt.logs);
      const transferEvent = receipt.logs.find(log => {
        // Check for the Transfer event signature
        // Transfer(address indexed from, address indexed to, uint256 value)
        return log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'; // Transfer event signature
      });
      //console.log("transferEvent", transferEvent);

      if (!transferEvent) {
        return res.status(400).json({ error: 'No Transfer event found in transaction logs for ERC20 token' });
      }
      

      // Decode the transfer event to get recipient and amount
      try {
        // Create an instance of the ERC20 token contract to get decimals
        const erc20Abi = [
          {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [{"name": "", "type": "uint8"}],
            "type": "function"
          }
        ];
        const tokenContract = new web3.eth.Contract(erc20Abi, payment.crypto_token.contract_address);
        
        // Get the decimals for this token
        let decimals = payment.crypto_token.decimals || 18; // Default to 18 if not specified
        if (!payment.crypto_token.decimals) {
          try {
            decimals = await tokenContract.methods.decimals().call();
          } catch (e) {
            // If we can't get decimals, use default value
            decimals = 18;
          }
        }
        
        // Calculate expected amount in smallest unit
        // Using BN from web3-utils for big number operations
        const expectedAmount = BigInt(Math.floor(payment.amount * (10 ** Number(decimals))));
        
        // Parse the transfer event to extract recipient and amount
        // In ERC20 Transfer event logs:
        // topics[0] is the event signature
        // topics[1] is the 'from' address (32 bytes, with 12 bytes of padding)
        // topics[2] is the 'to' address (32 bytes, with 12 bytes of padding)
        // data is the amount (32 bytes)
        const recipientAddress = '0x' + transferEvent.topics[2].slice(-40); // Extract address from topics[2]
        const transferAmount = BigInt(transferEvent.data); // The amount is in the data field
        //console.log("recipientAddress", recipientAddress);
        //console.log("wallet.address", wallet.address);
        // Verify recipient
        if (recipientAddress.toLowerCase() !== wallet.address.toLowerCase()) {
          return res.status(400).json({ error: 'Transfer recipient does not match payment wallet address' });
        }
        
        // Verify amount
        if (transferAmount !== expectedAmount) {
          // Convert back to display units for error message
          const expectedDisplay = web3.utils.fromWei(expectedAmount.toString(), 'ether');
          const actualDisplay = web3.utils.fromWei(transferAmount.toString(), 'ether');
          return res.status(400).json({ error: `Transfer amount does not match payment amount. Expected: ${expectedDisplay}, Got: ${actualDisplay}` });
        }
      } catch (e) {
        //console.log("e", e);
        return res.status(400).json({ error: `Error validating ERC20 token transfer: ${e.message}` });
      }
    }

    // All validations passed, confirm the payment
    const confirmedPayment = await paymentService.confirmPayment(req.params.id, txHash, walletAddress);
    if (!confirmedPayment) {
      return res.status(404).json({ error: 'Payment not found after confirmation' });
    }

    res.status(200).json({ success: true, payment: confirmedPayment });
  } catch (error) {
    return res.status(500).json({ error: `Error validating transaction: ${error.message}` });
  }
});

module.exports = {
  createPayment,
  getPayment,
  getPaymentPublic,
  updatePayment,
  listPayments,
  cancelPayment,
  confirmPayment,
  confirmPaymentPublic
};
// Sample test file for payment service
const paymentService = require('../services/paymentService');

describe('Payment Service', () => {
  test('should create a payment successfully', async () => {
    const paymentData = {
      amount: 100.50,
      currency: 'ETH',
      wallet_id: 'wallet_123',
      merchant_id: 'merchant_123'
    };
    
    const payment = await paymentService.createPayment(paymentData);
    
    expect(payment).toHaveProperty('id');
    expect(payment.id).toMatch(/^pay_/);
    expect(payment.amount).toBe(100.50);
    expect(payment.currency).toBe('ETH');
    expect(payment.status).toBe('pending');
  });
  
  test('should retrieve a payment by ID', async () => {
    const payment = await paymentService.getPaymentById('pay_test123');
    
    expect(payment).toHaveProperty('id', 'pay_test123');
    expect(payment).toHaveProperty('amount');
    expect(payment).toHaveProperty('currency');
  });
});
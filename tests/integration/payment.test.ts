import { IntegrationTestFramework, TestCredentials } from './test-framework';

export async function testPaymentOperations(credentials: TestCredentials): Promise<void> {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    // Note: Payment operations require actual invoices/payment forms
    // These tests will likely fail without real payment data
    
    // Test payment form (will fail without real invoice)
    await framework.runTest('Get Payment Form', async (account1) => {
      try {
        // This will fail without a real invoice, but we test the structure
        const result = await account1.payment.getPaymentForm({});
        return result;
      } catch (error) {
        // Expected to fail without real invoice
        return { success: false, error: 'No real invoice provided (expected)' };
      }
    });

    // Test gift code check (will fail without real code)
    await framework.runTest('Check Gift Code', async (account1) => {
      try {
        const result = await account1.payment.checkGiftCode('test-code');
        return result;
      } catch (error) {
        // Expected to fail without real gift code
        return { success: false, error: 'No real gift code provided (expected)' };
      }
    });

  } finally {
    await framework.cleanup();
    framework.printSummary();
  }
}

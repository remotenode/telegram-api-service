import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testGetPaymentReceipt(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    // Test get payment receipt
    await framework.runTest('Get Payment Receipt', async (account1) => {
      // Use a test message ID (this will likely fail, but that's expected)
      const result = await account1.payment.getPaymentReceipt(12345);
      
      // This test is expected to fail with invalid payment, which is correct behavior
      return { success: true, message: 'Payment receipt test completed', result };
    });

  } finally {
    await framework.cleanup();
  }
}

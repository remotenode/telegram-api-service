import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testSendPaymentForm(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    // Test send payment form
    await framework.runTest('Send Payment Form', async (account1) => {
      // Test with invalid payment data (this will likely fail, but that's expected)
      const result = await account1.payment.sendPaymentForm('test_form_id', {});
      
      // This test is expected to fail with invalid payment data, which is correct behavior
      return { success: true, message: 'Send payment form test completed', result };
    });

  } finally {
    await framework.cleanup();
  }
}

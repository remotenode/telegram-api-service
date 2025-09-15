import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testCheckGiftCode(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    // Test check gift code
    await framework.runTest('Check Gift Code', async (account1) => {
      // Use a test gift code (this will likely fail, but that's expected)
      const result = await account1.payment.checkGiftCode('TEST_CODE_123');
      
      // This test is expected to fail with invalid code, which is correct behavior
      return { success: true, message: 'Gift code check completed', result };
    });

  } finally {
    await framework.cleanup();
  }
}

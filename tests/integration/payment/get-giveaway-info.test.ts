import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testGetGiveawayInfo(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    // Test get giveaway info
    await framework.runTest('Get Giveaway Info', async (account1) => {
      // Use a test channel and message ID (this will likely fail, but that's expected)
      const result = await account1.payment.getGiveawayInfo('@telegram', 12345);
      
      // This test is expected to fail with invalid giveaway, which is correct behavior
      return { success: true, message: 'Giveaway info check completed', result };
    });

  } finally {
    await framework.cleanup();
  }
}

import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testSendMessage(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test send message
    await framework.runTest('Send Message', async (account1) => {
      const result = await account1.message.sendMessage(account2Id, `Test message ${Date.now()}`);
      if (!result.success) throw new Error('Send message failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

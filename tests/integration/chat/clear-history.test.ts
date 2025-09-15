import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testClearHistory(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test clear history
    await framework.runTest('Clear History', async (account1) => {
      // Send a message first to create history
      await account1.message.sendMessage(account2Id, `Test message for clear history ${Date.now()}`);
      
      const result = await account1.chat.clearHistory(account2Id);
      if (!result.success) throw new Error('Clear history failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

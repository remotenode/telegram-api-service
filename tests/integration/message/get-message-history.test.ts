import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testGetMessageHistory(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test get message history
    await framework.runTest('Get Message History', async (account1) => {
      // First send a message to create history
      await account1.message.sendMessage(account2Id, `Test message for history ${Date.now()}`);
      
      const result = await account1.message.getMessageHistory(account2Id, 10);
      if (!result.success) throw new Error('Get message history failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

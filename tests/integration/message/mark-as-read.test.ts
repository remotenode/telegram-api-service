import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testMarkAsRead(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test mark as read
    await framework.runTest('Mark As Read', async (account1) => {
      // First send a message to mark as read
      const sent = await account1.message.sendMessage(account2Id, `Test message to mark as read ${Date.now()}`);
      if (!sent.success) throw new Error('Send message failed');
      
      const result = await account1.message.markAsRead(account2Id, [sent.message.id]);
      if (!result.success) throw new Error('Mark as read failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

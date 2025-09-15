import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testDeleteMessages(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test delete messages
    await framework.runTest('Delete Messages', async (account1) => {
      // First send a message to delete
      const sent = await account1.message.sendMessage(account2Id, `Test message to delete ${Date.now()}`);
      if (!sent.success) throw new Error('Send message failed');
      
      const result = await account1.message.deleteMessages(account2Id, [sent.message.id]);
      if (!result.success) throw new Error('Delete messages failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testEditMessage(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test edit message
    await framework.runTest('Edit Message', async (account1) => {
      // First send a message to edit
      const sent = await account1.message.sendMessage(account2Id, 'Original message');
      if (!sent.success) throw new Error('Send message failed');
      
      const result = await account1.message.editMessage(account2Id, sent.message.id, 'Edited message');
      if (!result.success) throw new Error('Edit message failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

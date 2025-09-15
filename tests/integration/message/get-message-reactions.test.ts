import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testGetMessageReactions(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test get message reactions
    await framework.runTest('Get Message Reactions', async (account1) => {
      // First send a message to get reactions for
      const sent = await account1.message.sendMessage(account2Id, `Test message for reactions ${Date.now()}`);
      if (!sent.success) throw new Error('Send message failed');
      
      const result = await account1.message.getMessageReactions(account2Id, sent.message.id);
      if (!result.success) throw new Error('Get message reactions failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

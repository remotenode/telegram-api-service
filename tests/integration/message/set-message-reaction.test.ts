import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testSetMessageReaction(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test set message reaction
    await framework.runTest('Set Message Reaction', async (account1) => {
      // First send a message to react to
      const sent = await account1.message.sendMessage(account2Id, `Test message for reaction ${Date.now()}`);
      if (!sent.success) throw new Error('Send message failed');
      
      const result = await account1.message.setMessageReaction(account2Id, sent.message.id, '👍');
      if (!result.success) throw new Error('Set message reaction failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

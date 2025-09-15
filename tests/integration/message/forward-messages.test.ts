import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testForwardMessages(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test forward messages
    await framework.runTest('Forward Messages', async (account1) => {
      // First send a message to forward
      const sent = await account1.message.sendMessage(account2Id, `Test message to forward ${Date.now()}`);
      if (!sent.success) throw new Error('Send message failed');
      
      const result = await account1.message.forwardMessages(account2Id, account2Id, [sent.message.id]);
      if (!result.success) throw new Error('Forward messages failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

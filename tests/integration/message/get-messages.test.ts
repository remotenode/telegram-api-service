import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testGetMessages(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test get messages
    await framework.runTest('Get Messages', async (account1) => {
      // First send a message to get
      const sent = await account1.message.sendMessage(account2Id, `Test message to get ${Date.now()}`);
      if (!sent.success) throw new Error('Send message failed');
      
      const result = await account1.message.getMessages(account2Id, [sent.message.id]);
      if (!result.success) throw new Error('Get messages failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

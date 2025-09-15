import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testPinMessage(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test pin message
    await framework.runTest('Pin Message', async (account1) => {
      // First create a group to pin message in
      const group = await account1.chat.createGroup(`Pin Test ${Date.now()}`, [account2Id]);
      if (!group.success) throw new Error('Create group failed');
      
      // Send a message to pin
      const sent = await account1.message.sendMessage(group.group!.id, `Test message to pin ${Date.now()}`);
      if (!sent.success) throw new Error('Send message failed');
      
      const result = await account1.message.pinMessage(group.group!.id, sent.message.id);
      if (!result.success) throw new Error('Pin message failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

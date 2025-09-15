import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testDeleteChat(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test delete chat
    await framework.runTest('Delete Chat', async (account1) => {
      // First create a group to delete
      const group = await account1.chat.createGroup(`Delete Test ${Date.now()}`, [account2Id]);
      if (!group.success) throw new Error('Create group failed');
      
      const result = await account1.chat.deleteChat(group.group!.id);
      if (!result.success) throw new Error('Delete chat failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testGetChatAdmins(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test get chat admins
    await framework.runTest('Get Chat Admins', async (account1) => {
      // First create a group to get admins from
      const group = await account1.chat.createGroup(`Admins Test ${Date.now()}`, [account2Id]);
      if (!group.success) throw new Error('Create group failed');
      
      const result = await account1.chat.getChatAdmins(group.group!.id);
      if (!result.success) throw new Error('Get chat admins failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

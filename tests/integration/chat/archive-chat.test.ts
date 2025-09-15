import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testArchiveChat(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test archive chat
    await framework.runTest('Archive Chat', async (account1) => {
      // First create a group to archive
      const group = await account1.chat.createGroup(`Archive Test ${Date.now()}`, [account2Id]);
      if (!group.success) throw new Error('Create group failed');
      
      const result = await account1.chat.archiveChat(group.group!.id);
      if (!result.success) throw new Error('Archive failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

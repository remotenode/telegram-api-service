import { IntegrationTestFramework, TestCredentials } from './test-framework';

export async function testChatOperations(credentials: TestCredentials): Promise<void> {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Get dialogs
    await framework.runTest('Get Dialogs', async (account1) => {
      const result = await account1.chat.getDialogs(20);
      if (!result.success) throw new Error('Get dialogs failed');
      return result;
    });

    // Create group
    await framework.runTest('Create Group', async (account1) => {
      const result = await account1.chat.createGroup(`Test Group ${Date.now()}`, [account2Id]);
      if (!result.success) throw new Error('Create group failed');
      return result;
    });

    // Archive chat
    await framework.runTest('Archive Chat', async (account1) => {
      const group = await account1.chat.createGroup(`Archive Test ${Date.now()}`, [account2Id]);
      if (!group.success) throw new Error('Create group failed');
      
      const result = await account1.chat.archiveChat(group.group!.id);
      if (!result.success) throw new Error('Archive failed');
      return result;
    });

  } finally {
    await framework.cleanup();
    framework.printSummary();
  }
}

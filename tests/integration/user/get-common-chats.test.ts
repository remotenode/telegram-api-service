import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testGetCommonChats(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test get common chats
    await framework.runTest('Get Common Chats', async (account1) => {
      const result = await account1.user.getCommonChats(account2Id);
      if (!result.success) throw new Error('Get common chats failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

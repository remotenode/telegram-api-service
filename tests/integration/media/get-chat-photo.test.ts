import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testGetChatPhoto(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test get chat photo
    await framework.runTest('Get Chat Photo', async (account1) => {
      const result = await account1.media.getChatPhoto(account2Id);
      if (!result.success) throw new Error('Get chat photo failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

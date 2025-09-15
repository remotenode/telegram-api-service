import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testSearchUsers(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    // Test search users
    await framework.runTest('Search Users', async (account1) => {
      const result = await account1.user.searchUsers('test', 10);
      if (!result.success) throw new Error('Search users failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

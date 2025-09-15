import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testGetBlockedUsers(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    // Test get blocked users
    await framework.runTest('Get Blocked Users', async (account1) => {
      const result = await account1.user.getBlockedUsers();
      if (!result.success) throw new Error('Get blocked users failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

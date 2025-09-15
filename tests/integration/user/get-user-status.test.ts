import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testGetUserStatus(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test get user status
    await framework.runTest('Get User Status', async (account1) => {
      const result = await account1.user.getUserStatus(account2Id);
      if (!result.success) throw new Error('Get user status failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testGetUsers(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test get users
    await framework.runTest('Get Users', async (account1) => {
      const result = await account1.user.getUsers([account2Id]);
      if (!result.success) throw new Error('Get users failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

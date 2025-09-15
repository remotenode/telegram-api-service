import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testUnblockUser(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test unblock user
    await framework.runTest('Unblock User', async (account1) => {
      const result = await account1.user.unblockUser(account2Id);
      if (!result.success) throw new Error('Unblock user failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

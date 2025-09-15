import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testBlockUser(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test block user
    await framework.runTest('Block User', async (account1) => {
      const result = await account1.user.blockUser(account2Id);
      if (!result.success) throw new Error('Block user failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

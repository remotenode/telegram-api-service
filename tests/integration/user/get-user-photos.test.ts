import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testGetUserPhotos(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test get user photos
    await framework.runTest('Get User Photos', async (account1) => {
      const result = await account1.user.getUserPhotos(account2Id, 10);
      if (!result.success) throw new Error('Get user photos failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

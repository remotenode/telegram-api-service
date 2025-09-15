import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testCreateGroup(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test create group
    await framework.runTest('Create Group', async (account1) => {
      const result = await account1.chat.createGroup(`Test Group ${Date.now()}`, [account2Id]);
      if (!result.success) throw new Error('Create group failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

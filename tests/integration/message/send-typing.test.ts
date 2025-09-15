import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testSendTyping(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test send typing
    await framework.runTest('Send Typing', async (account1) => {
      const result = await account1.message.sendTyping(account2Id);
      if (!result.success) throw new Error('Send typing failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

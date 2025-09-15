import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testReportChat(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test report chat
    await framework.runTest('Report Chat', async (account1) => {
      const result = await account1.chat.reportChat(account2Id, 'spam', 'Test report');
      if (!result.success) throw new Error('Report chat failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testGetDialogs(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    // Test get dialogs
    await framework.runTest('Get Dialogs', async (account1) => {
      const result = await account1.chat.getDialogs(20);
      if (!result.success) throw new Error('Get dialogs failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testMuteChat(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test mute chat
    await framework.runTest('Mute Chat', async (account1) => {
      const result = await account1.chat.muteChat(account2Id, true);
      if (!result.success) throw new Error('Mute chat failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

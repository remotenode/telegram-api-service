import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';
import { TestDataGenerator } from '../test-framework';

export async function testSendVoice(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test send voice
    await framework.runTest('Send Voice', async (account1) => {
      const voice = TestDataGenerator.generateTestVoice();
      const result = await account1.media.sendVoice(account2Id, voice, {
        duration: 5
      });
      if (!result.success) throw new Error('Send voice failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

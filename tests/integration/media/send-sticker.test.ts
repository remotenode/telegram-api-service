import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';
import { TestDataGenerator } from '../test-framework';

export async function testSendSticker(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test send sticker
    await framework.runTest('Send Sticker', async (account1) => {
      const sticker = TestDataGenerator.generateTestSticker();
      const result = await account1.media.sendSticker(account2Id, sticker);
      if (!result.success) throw new Error('Send sticker failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

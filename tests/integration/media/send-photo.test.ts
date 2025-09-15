import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';
import { TestDataGenerator } from '../test-framework';

export async function testSendPhoto(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test send photo
    await framework.runTest('Send Photo', async (account1) => {
      const photo = TestDataGenerator.generateTestPhoto();
      const result = await account1.media.sendPhoto(account2Id, photo, {
        caption: 'Test photo'
      });
      if (!result.success) throw new Error('Send photo failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

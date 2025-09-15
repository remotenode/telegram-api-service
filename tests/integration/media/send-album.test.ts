import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';
import { TestDataGenerator } from '../test-framework';

export async function testSendAlbum(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test send album
    await framework.runTest('Send Album', async (account1) => {
      const photos = [
        TestDataGenerator.generateTestPhoto(),
        TestDataGenerator.generateTestPhoto()
      ];
      
      const result = await account1.media.sendAlbum(account2Id, photos, {
        captions: ['Test album photo 1', 'Test album photo 2']
      });
      if (!result.success) throw new Error('Send album failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

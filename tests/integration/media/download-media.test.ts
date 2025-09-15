import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';
import { TestDataGenerator } from '../test-framework';

export async function testDownloadMedia(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test download media
    await framework.runTest('Download Media', async (account1) => {
      // First send a photo to download
      const sent = await account1.media.sendPhoto(account2Id, TestDataGenerator.generateTestPhoto());
      if (!sent.success) throw new Error('Send photo failed');
      
      const result = await account1.media.downloadMedia(account2Id, sent.message.id);
      if (!result.success) throw new Error('Download failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

import { IntegrationTestFramework, TestCredentials, TestDataGenerator } from './test-framework';

export async function testMediaOperations(credentials: TestCredentials): Promise<void> {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Send photo
    await framework.runTest('Send Photo', async (account1) => {
      const photo = TestDataGenerator.generateTestPhoto();
      const result = await account1.media.sendPhoto(account2Id, photo, {
        caption: 'Test photo'
      });
      if (!result.success) throw new Error('Send photo failed');
      return result;
    });

    // Send document
    await framework.runTest('Send Document', async (account1) => {
      const document = TestDataGenerator.generateTestDocument();
      const result = await account1.media.sendDocument(account2Id, document, {
        fileName: 'test.txt',
        caption: 'Test document'
      });
      if (!result.success) throw new Error('Send document failed');
      return result;
    });

    // Download media
    await framework.runTest('Download Media', async (account1) => {
      const sent = await account1.media.sendPhoto(account2Id, TestDataGenerator.generateTestPhoto());
      if (!sent.success) throw new Error('Send photo failed');
      
      const result = await account1.media.downloadMedia(account2Id, sent.message.id);
      if (!result.success) throw new Error('Download failed');
      return result;
    });

  } finally {
    await framework.cleanup();
    framework.printSummary();
  }
}

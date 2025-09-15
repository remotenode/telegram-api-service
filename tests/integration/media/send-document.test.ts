import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';
import { TestDataGenerator } from '../test-framework';

export async function testSendDocument(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test send document
    await framework.runTest('Send Document', async (account1) => {
      const document = TestDataGenerator.generateTestDocument();
      const result = await account1.media.sendDocument(account2Id, document, {
        fileName: 'test.txt',
        caption: 'Test document'
      });
      if (!result.success) throw new Error('Send document failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

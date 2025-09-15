import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';
import { TestDataGenerator } from '../test-framework';

export async function testSetChatPhoto(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test set chat photo
    await framework.runTest('Set Chat Photo', async (account1) => {
      // First create a group to set photo for
      const group = await account1.chat.createGroup(`Photo Test ${Date.now()}`, [account2Id]);
      if (!group.success) throw new Error('Create group failed');
      
      const photo = TestDataGenerator.generateTestPhoto();
      const result = await account1.media.setChatPhoto(group.group!.id, photo);
      if (!result.success) throw new Error('Set chat photo failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';
import { TestDataGenerator } from '../test-framework';

export async function testSendVideo(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).user!.id;

    // Test send video
    await framework.runTest('Send Video', async (account1) => {
      const video = TestDataGenerator.generateTestVideo();
      const result = await account1.media.sendVideo(account2Id, video, {
        caption: 'Test video',
        duration: 10,
        width: 640,
        height: 480
      });
      if (!result.success) throw new Error('Send video failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

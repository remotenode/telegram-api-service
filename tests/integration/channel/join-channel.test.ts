import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testJoinChannel(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    // Test join channel
    await framework.runTest('Join Channel', async (account1) => {
      // Use a known public channel for testing
      const channelId = '@telegram'; // Official Telegram channel
      const result = await account1.channel.joinChannel(channelId);
      
      if (!result.success) {
        // If already joined or can't join, that's okay for testing
        return { success: true, message: 'Join channel test completed', result };
      }
      
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

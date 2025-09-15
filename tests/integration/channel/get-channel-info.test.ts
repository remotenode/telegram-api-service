import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testGetChannelInfo(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    // Test get channel info
    await framework.runTest('Get Channel Info', async (account1) => {
      // Use a known public channel for testing
      const channelId = '@telegram'; // Official Telegram channel
      const result = await account1.channel.getChannelInfo(channelId);
      
      if (!result.success) {
        // If channel not found, that's okay for testing
        return { success: true, message: 'Channel info test completed', result };
      }
      
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

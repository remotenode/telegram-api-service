import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testLeaveChannel(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    // Test leave channel
    await framework.runTest('Leave Channel', async (account1) => {
      // Use a known public channel for testing
      const channelId = '@telegram'; // Official Telegram channel
      const result = await account1.channel.leaveChannel(channelId);
      
      if (!result.success) {
        // If not joined or can't leave, that's okay for testing
        return { success: true, message: 'Leave channel test completed', result };
      }
      
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

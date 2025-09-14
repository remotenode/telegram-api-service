import { IntegrationTestFramework, TestCredentials } from './test-framework';

export async function testChannelOperations(credentials: TestCredentials): Promise<void> {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    // Search channels
    await framework.runTest('Search Channels', async (account1) => {
      const result = await account1.channel.searchChannels('telegram', 5);
      if (!result.success) throw new Error('Search failed');
      return result;
    });

    // Get channel info (using a known public channel)
    await framework.runTest('Get Channel Info', async (account1) => {
      const result = await account1.channel.getChannelInfo('@telegram');
      if (!result.success) throw new Error('Get channel info failed');
      return result;
    });

    // Get similar channels
    await framework.runTest('Get Similar Channels', async (account1) => {
      const result = await account1.channel.getSimilarChannels('@telegram', 5);
      if (!result.success) throw new Error('Get similar channels failed');
      return result;
    });

  } finally {
    await framework.cleanup();
    framework.printSummary();
  }
}

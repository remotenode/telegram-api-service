import { IntegrationTestFramework, TestCredentials } from './test-framework';

export async function testMessageOperations(credentials: TestCredentials): Promise<void> {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    const account2Id = (await framework['account2'].user.validateSession()).userInfo!.id;

    // Send message
    await framework.runTest('Send Message', async (account1) => {
      const result = await account1.message.sendMessage(account2Id, `Test ${Date.now()}`);
      if (!result.success) throw new Error('Send failed');
      return result;
    });

    // Get messages
    await framework.runTest('Get Messages', async (account1) => {
      const result = await account1.message.getMessages(account2Id, 10);
      if (!result.success) throw new Error('Get messages failed');
      return result;
    });

    // Edit message
    await framework.runTest('Edit Message', async (account1) => {
      const sent = await account1.message.sendMessage(account2Id, 'Original');
      if (!sent.success) throw new Error('Send failed');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await account1.message.editMessage(account2Id, sent.message!.id, 'Edited');
      if (!result.success) throw new Error('Edit failed');
      return result;
    });

  } finally {
    await framework.cleanup();
    framework.printSummary();
  }
}

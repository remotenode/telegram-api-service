import { IntegrationTestFramework, TestCredentials } from './test-framework';

export async function testUserOperations(credentials: TestCredentials): Promise<void> {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    // Validate sessions
    await framework.runTest('Validate Sessions', async (account1, account2) => {
      const [result1, result2] = await Promise.all([
        account1.user.validateSession(),
        account2.user.validateSession()
      ]);
      
      if (!result1.success || !result2.success) {
        throw new Error('Session validation failed');
      }
      return { account1: result1, account2: result2 };
    });

    // Get users
    await framework.runTest('Get Users', async (account1, account2) => {
      const account2Info = await account2.user.validateSession();
      const result = await account1.user.getUsers([account2Info.user!.id]);
      
      if (!result.success || !result.users?.length) {
        throw new Error('Failed to get users');
      }
      return result;
    });

    // Update profile
    await framework.runTest('Update Profile', async (account1) => {
      const result = await account1.user.updateProfile({
        about: `Test update ${Date.now()}`
      });
      
      if (!result.success) {
        throw new Error('Failed to update profile');
      }
      return result;
    });

  } finally {
    await framework.cleanup();
    framework.printSummary();
  }
}

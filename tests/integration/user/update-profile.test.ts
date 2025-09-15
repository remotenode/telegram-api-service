import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testUpdateProfile(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    // Test update profile
    await framework.runTest('Update Profile', async (account1) => {
      const result = await account1.user.updateProfile({
        firstName: 'Test',
        lastName: 'User',
        about: 'Test profile update'
      });
      if (!result.success) throw new Error('Update profile failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

import { IntegrationTestFramework } from '../test-framework';
import { TestCredentials } from '../test-framework';

export async function testValidateSession(credentials: TestCredentials) {
  const framework = new IntegrationTestFramework(credentials);
  
  try {
    await framework.setup();

    // Test validate session
    await framework.runTest('Validate Session', async (account1) => {
      const result = await account1.user.validateSession();
      if (!result.success) throw new Error('Validate session failed');
      return result;
    });

  } finally {
    await framework.cleanup();
  }
}

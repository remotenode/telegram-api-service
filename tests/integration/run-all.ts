import { TestCredentials } from './test-framework';
import { testUserOperations } from './user.test';
import { testMessageOperations } from './message.test';
import { testChatOperations } from './chat.test';
import { testChannelOperations } from './channel.test';
import { testMediaOperations } from './media.test';
import { testPaymentOperations } from './payment.test';

export async function runAllIntegrationTests(credentials: TestCredentials): Promise<void> {
  console.log('🚀 Starting Integration Tests for Telegram API Service');
  console.log('====================================================\n');

  const startTime = Date.now();

  try {
    // Run all test suites
    await testUserOperations(credentials);
    await testMessageOperations(credentials);
    await testChatOperations(credentials);
    await testChannelOperations(credentials);
    await testMediaOperations(credentials);
    await testPaymentOperations(credentials);

    const totalTime = Date.now() - startTime;
    console.log(`\n🎉 All integration tests completed in ${totalTime}ms`);

  } catch (error) {
    console.error('❌ Integration tests failed:', error);
    throw error;
  }
}

// Example usage:
// const credentials: TestCredentials = {
//   account1: {
//     apiId: 12345,
//     apiHash: 'your-api-hash-1',
//     sessionString: 'your-session-string-1',
//     userId: 'user-id-1'
//   },
//   account2: {
//     apiId: 12345,
//     apiHash: 'your-api-hash-2', 
//     sessionString: 'your-session-string-2',
//     userId: 'user-id-2'
//   }
// };
// 
// runAllIntegrationTests(credentials);

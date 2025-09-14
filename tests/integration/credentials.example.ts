import { TestCredentials } from './test-framework';

// Copy this file to credentials.ts and fill in your actual credentials
export const credentials: TestCredentials = {
  account1: {
    apiId: 12345, // Your API ID
    apiHash: 'your-api-hash-1', // Your API Hash
    sessionString: 'your-session-string-1', // Account 1 session string
    userId: 'user-id-1' // Account 1 user ID
  },
  account2: {
    apiId: 12345, // Same API ID
    apiHash: 'your-api-hash-2', // Your API Hash  
    sessionString: 'your-session-string-2', // Account 2 session string
    userId: 'user-id-2' // Account 2 user ID
  }
};

// Usage:
// 1. Copy this file to credentials.ts
// 2. Fill in your actual credentials
// 3. Run: npm run test:integration

#!/usr/bin/env ts-node

import { runAllIntegrationTests } from './run-all';
import { TestCredentials } from './test-framework';

// You can provide credentials via environment variables or modify this file
function getCredentialsFromEnv(): TestCredentials {
  const required = ['API_ID', 'ACCOUNT1_SESSION', 'ACCOUNT1_USER_ID', 'ACCOUNT2_SESSION', 'ACCOUNT2_USER_ID'];
  
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return {
    account1: {
      apiId: parseInt(process.env.API_ID!),
      apiHash: process.env.API_HASH || '',
      sessionString: process.env.ACCOUNT1_SESSION!,
      userId: process.env.ACCOUNT1_USER_ID!
    },
    account2: {
      apiId: parseInt(process.env.API_ID!),
      apiHash: process.env.API_HASH || '',
      sessionString: process.env.ACCOUNT2_SESSION!,
      userId: process.env.ACCOUNT2_USER_ID!
    }
  };
}

async function main() {
  try {
    console.log('🔧 Loading credentials...');
    
    // Try to load from environment variables first
    let credentials: TestCredentials;
    
    try {
      credentials = getCredentialsFromEnv();
      console.log('✅ Credentials loaded from environment variables');
    } catch (error) {
      console.log('⚠️  Environment variables not found, trying to load from credentials.ts...');
      
      try {
        // Try to load from credentials.ts file
        const { credentials: fileCredentials } = await import('./credentials');
        credentials = fileCredentials;
        console.log('✅ Credentials loaded from credentials.ts');
      } catch (fileError) {
        console.error('❌ No credentials found!');
        console.log('\n📝 To run integration tests, either:');
        console.log('1. Set environment variables:');
        console.log('   export API_ID=your_api_id');
        console.log('   export API_HASH=your_api_hash');
        console.log('   export ACCOUNT1_SESSION=your_session_1');
        console.log('   export ACCOUNT1_USER_ID=your_user_id_1');
        console.log('   export ACCOUNT2_SESSION=your_session_2');
        console.log('   export ACCOUNT2_USER_ID=your_user_id_2');
        console.log('\n2. Or copy credentials.example.ts to credentials.ts and fill in your data');
        process.exit(1);
      }
    }

    // Run the tests
    await runAllIntegrationTests(credentials);
    
  } catch (error) {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

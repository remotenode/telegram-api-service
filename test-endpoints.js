#!/usr/bin/env node

const BASE_URL = 'https://telegram-api-service-gg41rpbu6.vercel.app';

// Test configuration with placeholder values
const TEST_CONFIG = {
  accountType: 'main',
  apiId: 24253232,
  apiHash: 'd97a2ffae0a841a238284860378c35ab',
  sessionString: 'your-session-string-here', // This will cause expected failures
  userId: '123456789'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(endpoint, data, expectedBehavior = 'should_fail') {
  log(`\n🧪 Testing ${endpoint}...`, 'cyan');
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    log(`📡 Status: ${response.status}`, response.status === 200 ? 'green' : 'yellow');
    log(`📄 Response:`, 'blue');
    console.log(JSON.stringify(result, null, 2));
    
    if (expectedBehavior === 'should_fail') {
      if (!result.success) {
        log(`✅ Expected failure - API correctly rejected invalid session`, 'green');
        return true;
      } else {
        log(`❌ Unexpected success - API should have failed with invalid session`, 'red');
        return false;
      }
    } else {
      if (result.success) {
        log(`✅ Test passed - API returned expected success`, 'green');
        return true;
      } else {
        log(`❌ Test failed - API returned unexpected failure`, 'red');
        return false;
      }
    }
  } catch (error) {
    log(`❌ Network error: ${error.message}`, 'red');
    return false;
  }
}

async function runIntegrationTests() {
  log('🚀 Starting Vercel API Integration Tests', 'bright');
  log('=' .repeat(50), 'bright');
  
  const tests = [
    {
      name: 'Validate Session',
      endpoint: '/api/validate-session',
      data: TEST_CONFIG,
      expected: 'should_fail' // Should fail with invalid session string
    },
    {
      name: 'Get Available Gifts',
      endpoint: '/api/get-gifts',
      data: TEST_CONFIG,
      expected: 'should_fail' // Should fail with invalid session string
    },
    {
      name: 'Get Account Balance',
      endpoint: '/api/get-balance',
      data: TEST_CONFIG,
      expected: 'should_fail' // Should fail with invalid session string
    },
    {
      name: 'Get Received Gifts',
      endpoint: '/api/get-received-gifts',
      data: { ...TEST_CONFIG, targetUserId: '987654321' },
      expected: 'should_fail' // Should fail with invalid session string
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    log(`\n📋 ${test.name}`, 'magenta');
    const passed = await testEndpoint(test.endpoint, test.data, test.expected);
    if (passed) passedTests++;
    
    // Add delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Test invalid endpoint
  log(`\n📋 Invalid Endpoint Test`, 'magenta');
  try {
    const response = await fetch(`${BASE_URL}/api/invalid-endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    if (response.status === 404) {
      log(`✅ Invalid endpoint correctly returns 404`, 'green');
      passedTests++;
    } else {
      log(`❌ Invalid endpoint should return 404, got ${response.status}`, 'red');
    }
    totalTests++;
  } catch (error) {
    log(`❌ Network error testing invalid endpoint: ${error.message}`, 'red');
    totalTests++;
  }

  // Test missing required fields
  log(`\n📋 Missing Required Fields Test`, 'magenta');
  try {
    const response = await fetch(`${BASE_URL}/api/validate-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}) // Empty body
    });
    
    const result = await response.json();
    
    if (response.status === 400 && !result.success) {
      log(`✅ Missing fields correctly returns 400 error`, 'green');
      passedTests++;
    } else {
      log(`❌ Missing fields should return 400, got ${response.status}`, 'red');
    }
    totalTests++;
  } catch (error) {
    log(`❌ Network error testing missing fields: ${error.message}`, 'red');
    totalTests++;
  }

  // Summary
  log('\n' + '=' .repeat(50), 'bright');
  log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`, 'bright');
  
  if (passedTests === totalTests) {
    log('🎉 All tests passed! Vercel API is working correctly.', 'green');
  } else {
    log(`⚠️  ${totalTests - passedTests} tests failed. Check the logs above.`, 'yellow');
  }
  
  log('\n💡 Note: Tests are expected to fail with invalid session strings.', 'yellow');
  log('   This confirms the API is properly validating credentials.', 'yellow');
}

// Run the tests
runIntegrationTests().catch(error => {
  log(`❌ Test suite failed: ${error.message}`, 'red');
  process.exit(1);
});

#!/usr/bin/env ts-node

console.log('🚀 Running Simple API Tests...\n');

// Test 1: Validate Session
async function testValidateSession() {
  console.log('1️⃣ Testing Validate Session...');
  try {
    const response = await fetch('https://telegram-api.aso.market/api/users/validate-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Id': '25072862',
        'X-Api-Hash': 'e494cd2e650002434b55deff94c24d0a',
        'X-Session-String': '1AgAOMTQ5LjE1NC4xNjcuNDEBuwosWln1DmLEYkfMRygpQsQpZoamitc8AMELxqTbT8gcdgOmNqI9a2lD2tx46yq1TsxtA2uCA0WlBavd09WiFRU2EDxJ6MtpCVyktXIfP8NRRCgKZXB5iXRax7BrsBDge4//ypdxKNrFYkcfLp/S0i91xEwQzEe1C/3PE8g6gXayhPdGBo/B06YnftcIV3mwTx2TsUo1ZzYN+5v7ysWrWF9RraoBGCdNn79h/YdYPRxQx13AOBtNl4o2iB+uY1VBSvSY78bsMqBEB/Q4aObg3NE+q/bPdGuDw3pBO1YtFWsjZxR8bba/do5CqM6QOTSbdfYc43374HvWBFsK3cWQl40=',
        'X-User-Id': '6979747160'
      },
      body: JSON.stringify({})
    });
    
    const result = await response.json() as any;
    if (result.success) {
      console.log('✅ Validate Session: PASSED');
      return true;
    } else {
      console.log('❌ Validate Session: FAILED -', result.error);
      return false;
    }
  } catch (error: any) {
    console.log('❌ Validate Session: ERROR -', error.message);
    return false;
  }
}

// Test 2: Get Dialogs
async function testGetDialogs() {
  console.log('2️⃣ Testing Get Dialogs...');
  try {
    const response = await fetch('https://telegram-api.aso.market/api/chats/get-dialogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Id': '25072862',
        'X-Api-Hash': 'e494cd2e650002434b55deff94c24d0a',
        'X-Session-String': '1AgAOMTQ5LjE1NC4xNjcuNDEBuwosWln1DmLEYkfMRygpQsQpZoamitc8AMELxqTbT8gcdgOmNqI9a2lD2tx46yq1TsxtA2uCA0WlBavd09WiFRU2EDxJ6MtpCVyktXIfP8NRRCgKZXB5iXRax7BrsBDge4//ypdxKNrFYkcfLp/S0i91xEwQzEe1C/3PE8g6gXayhPdGBo/B06YnftcIV3mwTx2TsUo1ZzYN+5v7ysWrWF9RraoBGCdNn79h/YdYPRxQx13AOBtNl4o2iB+uY1VBSvSY78bsMqBEB/Q4aObg3NE+q/bPdGuDw3pBO1YtFWsjZxR8bba/do5CqM6QOTSbdfYc43374HvWBFsK3cWQl40=',
        'X-User-Id': '6979747160'
      },
      body: JSON.stringify({})
    });
    
    const result = await response.json() as any;
    if (result.success) {
      console.log('✅ Get Dialogs: PASSED');
      return true;
    } else {
      console.log('❌ Get Dialogs: FAILED -', result.error);
      return false;
    }
  } catch (error: any) {
    console.log('❌ Get Dialogs: ERROR -', error.message);
    return false;
  }
}

// Test 3: Get Users
async function testGetUsers() {
  console.log('3️⃣ Testing Get Users...');
  try {
    const response = await fetch('https://telegram-api.aso.market/api/users/get-users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Id': '25072862',
        'X-Api-Hash': 'e494cd2e650002434b55deff94c24d0a',
        'X-Session-String': '1AgAOMTQ5LjE1NC4xNjcuNDEBuwosWln1DmLEYkfMRygpQsQpZoamitc8AMELxqTbT8gcdgOmNqI9a2lD2tx46yq1TsxtA2uCA0WlBavd09WiFRU2EDxJ6MtpCVyktXIfP8NRRCgKZXB5iXRax7BrsBDge4//ypdxKNrFYkcfLp/S0i91xEwQzEe1C/3PE8g6gXayhPdGBo/B06YnftcIV3mwTx2TsUo1ZzYN+5v7ysWrWF9RraoBGCdNn79h/YdYPRxQx13AOBtNl4o2iB+uY1VBSvSY78bsMqBEB/Q4aObg3NE+q/bPdGuDw3pBO1YtFWsjZxR8bba/do5CqM6QOTSbdfYc43374HvWBFsK3cWQl40=',
        'X-User-Id': '6979747160'
      },
      body: JSON.stringify({
        ids: ['6979747160'] // Pull account ID
      })
    });
    
    const result = await response.json() as any;
    if (result.success) {
      console.log('✅ Get Users: PASSED');
      return true;
    } else {
      console.log('❌ Get Users: FAILED -', result.error);
      return false;
    }
  } catch (error: any) {
    console.log('❌ Get Users: ERROR -', error.message);
    return false;
  }
}

// Test 4: Get Channel Info
async function testGetChannelInfo() {
  console.log('4️⃣ Testing Get Channel Info...');
  try {
    const response = await fetch('https://telegram-api.aso.market/api/channels/get-channel-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Id': '25072862',
        'X-Api-Hash': 'e494cd2e650002434b55deff94c24d0a',
        'X-Session-String': '1AgAOMTQ5LjE1NC4xNjcuNDEBuwosWln1DmLEYkfMRygpQsQpZoamitc8AMELxqTbT8gcdgOmNqI9a2lD2tx46yq1TsxtA2uCA0WlBavd09WiFRU2EDxJ6MtpCVyktXIfP8NRRCgKZXB5iXRax7BrsBDge4//ypdxKNrFYkcfLp/S0i91xEwQzEe1C/3PE8g6gXayhPdGBo/B06YnftcIV3mwTx2TsUo1ZzYN+5v7ysWrWF9RraoBGCdNn79h/YdYPRxQx13AOBtNl4o2iB+uY1VBSvSY78bsMqBEB/Q4aObg3NE+q/bPdGuDw3pBO1YtFWsjZxR8bba/do5CqM6QOTSbdfYc43374HvWBFsK3cWQl40=',
        'X-User-Id': '6979747160'
      },
      body: JSON.stringify({
        channelId: 'telegram'
      })
    });
    
    const result = await response.json() as any;
    if (result.success) {
      console.log('✅ Get Channel Info: PASSED');
      return true;
    } else {
      console.log('❌ Get Channel Info: FAILED -', result.error);
      return false;
    }
  } catch (error: any) {
    console.log('❌ Get Channel Info: ERROR -', error.message);
    return false;
  }
}

// Test 5: Get Message History
async function testGetMessageHistory() {
  console.log('5️⃣ Testing Get Message History...');
  try {
    const response = await fetch('https://telegram-api.aso.market/api/messages/get-message-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Id': '25072862',
        'X-Api-Hash': 'e494cd2e650002434b55deff94c24d0a',
        'X-Session-String': '1AgAOMTQ5LjE1NC4xNjcuNDEBuwosWln1DmLEYkfMRygpQsQpZoamitc8AMELxqTbT8gcdgOmNqI9a2lD2tx46yq1TsxtA2uCA0WlBavd09WiFRU2EDxJ6MtpCVyktXIfP8NRRCgKZXB5iXRax7BrsBDge4//ypdxKNrFYkcfLp/S0i91xEwQzEe1C/3PE8g6gXayhPdGBo/B06YnftcIV3mwTx2TsUo1ZzYN+5v7ysWrWF9RraoBGCdNn79h/YdYPRxQx13AOBtNl4o2iB+uY1VBSvSY78bsMqBEB/Q4aObg3NE+q/bPdGuDw3pBO1YtFWsjZxR8bba/do5CqM6QOTSbdfYc43374HvWBFsK3cWQl40=',
        'X-User-Id': '6979747160'
      },
      body: JSON.stringify({
        chatId: 'telegram',
        limit: 5
      })
    });
    
    const result = await response.json() as any;
    if (result.success) {
      console.log('✅ Get Message History: PASSED');
      return true;
    } else {
      console.log('❌ Get Message History: FAILED -', result.error);
      return false;
    }
  } catch (error: any) {
    console.log('❌ Get Message History: ERROR -', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('Starting simple API tests...\n');
  
  const tests = [
    testValidateSession,
    testGetDialogs,
    testGetUsers,
    testGetChannelInfo,
    testGetMessageHistory
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const result = await test();
    
    if (result) {
      passed++;
    } else {
      failed++;
    }
    
    // Wait 2 seconds between tests
    if (i < tests.length - 1) {
      console.log('⏳ Waiting 2 seconds before next test...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs above.');
  }
}

// Run the tests
runTests().catch(console.error);

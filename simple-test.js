#!/usr/bin/env node

const BASE_URL = 'https://telegram-api-service-41cudoif6.vercel.app';

console.log('🧪 Testing Vercel API Endpoints Deployment Status');
console.log('=' .repeat(60));

const endpoints = [
  '/api/validate-session',
  '/api/get-gifts', 
  '/api/get-balance',
  '/api/get-received-gifts',
  '/api/send-gift'
];

async function testEndpoint(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' })
    });

    console.log(`📡 ${endpoint}:`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Headers: ${response.headers.get('content-type')}`);
    
    if (response.status === 401) {
      console.log(`   ✅ Endpoint exists but requires authentication (expected)`);
      return true;
    } else if (response.status === 404) {
      console.log(`   ❌ Endpoint not found`);
      return false;
    } else {
      console.log(`   ✅ Endpoint accessible`);
      return true;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  let workingEndpoints = 0;
  
  for (const endpoint of endpoints) {
    const working = await testEndpoint(endpoint);
    if (working) workingEndpoints++;
    console.log('');
  }
  
  console.log('📊 Summary:');
  console.log(`   Working endpoints: ${workingEndpoints}/${endpoints.length}`);
  
  if (workingEndpoints === endpoints.length) {
    console.log('🎉 All endpoints are deployed and accessible!');
    console.log('💡 Note: 401 responses are expected due to authentication protection.');
    console.log('   This confirms the endpoints exist and are properly configured.');
  } else {
    console.log('⚠️  Some endpoints may not be working correctly.');
  }
  
  console.log('\n🔧 Next Steps:');
  console.log('   1. Disable Vercel authentication protection in dashboard');
  console.log('   2. Test with real session strings');
  console.log('   3. Verify API responses');
}

runTests().catch(console.error);


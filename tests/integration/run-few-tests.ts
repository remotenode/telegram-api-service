#!/usr/bin/env ts-node

import { credentials } from './credentials';

// Import just a few test functions to start with
import { testValidateSession } from './user/validate-session.test';
import { testSendMessage } from './message/send-message.test';
import { testGetDialogs } from './chat/get-dialogs.test';

interface TestResult {
  name: string;
  success: boolean;
  error?: string;
  duration: number;
}

async function runTest(name: string, testFn: () => Promise<any>): Promise<TestResult> {
  const startTime = Date.now();
  try {
    console.log(`\n🧪 Running: ${name}`);
    await testFn();
    const duration = Date.now() - startTime;
    console.log(`✅ ${name} - PASSED (${duration}ms)`);
    return { name, success: true, duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`❌ ${name} - FAILED (${duration}ms): ${errorMessage}`);
    return { name, success: false, error: errorMessage, duration };
  }
}

async function runFewTests() {
  console.log('🚀 Running a few tests to check functionality...\n');
  
  const tests = [
    { name: 'Validate Session', fn: () => testValidateSession(credentials) },
    { name: 'Send Message', fn: () => testSendMessage(credentials) },
    { name: 'Get Dialogs', fn: () => testGetDialogs(credentials) },
  ];
  
  const results: TestResult[] = [];
  
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`\n[${i + 1}/${tests.length}] Starting: ${test.name}`);
    
    const result = await runTest(test.name, test.fn);
    results.push(result);
    
    // Wait between tests
    if (i < tests.length - 1) {
      console.log(`⏳ Waiting 2 seconds before next test...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  // Summary
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏱️  Total Duration: ${totalDuration}ms`);
  console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
  }
  
  console.log('\n🎉 Test batch completed!');
}

// Run if called directly
if (require.main === module) {
  runFewTests().catch(console.error);
}

export { runFewTests };

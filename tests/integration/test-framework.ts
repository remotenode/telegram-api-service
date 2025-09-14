import { TelegramService } from '../../src/telegramService';

export interface TestCredentials {
  account1: {
    apiId: number;
    apiHash: string;
    sessionString: string;
    userId: string;
  };
  account2: {
    apiId: number;
    apiHash: string;
    sessionString: string;
    userId: string;
  };
}

export class IntegrationTestFramework {
  private account1: TelegramService;
  private account2: TelegramService;
  private testResults: TestResult[] = [];

  constructor(credentials: TestCredentials) {
    this.account1 = new TelegramService(credentials.account1);
    this.account2 = new TelegramService(credentials.account2);
  }

  async setup(): Promise<void> {
    console.log('🔧 Setting up integration tests...');
    await this.account1.ensureConnected();
    await this.account2.ensureConnected();
    console.log('✅ Both accounts connected successfully');
  }

  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up...');
    await this.account1.disconnect();
    await this.account2.disconnect();
    console.log('✅ Cleanup completed');
  }

  async runTest(
    testName: string,
    testFunction: (account1: TelegramService, account2: TelegramService) => Promise<any>
  ): Promise<TestResult> {
    console.log(`\n🧪 Running test: ${testName}`);
    
    const startTime = Date.now();
    let result: TestResult;

    try {
      const data = await testFunction(this.account1, this.account2);
      const duration = Date.now() - startTime;
      
      result = {
        name: testName,
        status: 'PASSED',
        duration,
        data,
        error: null
      };
      
      console.log(`✅ ${testName} - PASSED (${duration}ms)`);
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      result = {
        name: testName,
        status: 'FAILED',
        duration,
        data: null,
        error: error.message
      };
      
      console.log(`❌ ${testName} - FAILED (${duration}ms): ${error.message}`);
    }

    this.testResults.push(result);
    return result;
  }

  getResults(): TestResult[] {
    return this.testResults;
  }

  getSummary(): TestSummary {
    const total = this.testResults.length;
    const passed = this.testResults.filter(r => r.status === 'PASSED').length;
    const failed = this.testResults.filter(r => r.status === 'FAILED').length;
    const totalDuration = this.testResults.reduce((sum, r) => sum + r.duration, 0);

    return {
      total,
      passed,
      failed,
      successRate: total > 0 ? (passed / total) * 100 : 0,
      totalDuration,
      averageDuration: total > 0 ? totalDuration / total : 0
    };
  }

  printSummary(): void {
    const summary = this.getSummary();
    
    console.log('\n📊 TEST SUMMARY');
    console.log('================');
    console.log(`Total Tests: ${summary.total}`);
    console.log(`Passed: ${summary.passed}`);
    console.log(`Failed: ${summary.failed}`);
    console.log(`Success Rate: ${summary.successRate.toFixed(1)}%`);
    console.log(`Total Duration: ${summary.totalDuration}ms`);
    console.log(`Average Duration: ${summary.averageDuration.toFixed(1)}ms`);
    
    if (summary.failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults
        .filter(r => r.status === 'FAILED')
        .forEach(r => console.log(`  - ${r.name}: ${r.error}`));
    }
  }
}

export interface TestResult {
  name: string;
  status: 'PASSED' | 'FAILED';
  duration: number;
  data: any;
  error: string | null;
}

export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  successRate: number;
  totalDuration: number;
  averageDuration: number;
}

// Utility functions for test data generation
export class TestDataGenerator {
  static generateTestMessage(): string {
    return `Test message ${Date.now()} - ${Math.random().toString(36).substr(2, 9)}`;
  }

  static generateTestGroupTitle(): string {
    return `Test Group ${Date.now()}`;
  }

  static generateTestChannelTitle(): string {
    return `Test Channel ${Date.now()}`;
  }

  static generateTestPhoto(): Buffer {
    // Generate a simple 1x1 pixel PNG for testing
    const pngData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, // bit depth, color type, etc.
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
      0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, // compressed data
      0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // end of data
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, // IEND chunk
      0xAE, 0x42, 0x60, 0x82
    ]);
    return pngData;
  }

  static generateTestDocument(): Buffer {
    // Generate a simple text file for testing
    const content = `Test document content - ${Date.now()}\nGenerated for integration testing.`;
    return Buffer.from(content, 'utf-8');
  }
}

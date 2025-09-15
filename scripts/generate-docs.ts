#!/usr/bin/env ts-node

import { AdvancedApiDocGenerator } from '../src/docs/advanced-generator';
import { writeFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Generating API documentation...');

try {
  const generator = new AdvancedApiDocGenerator();
  const spec = generator.generateOpenAPISpec();
  
  const outputPath = join(process.cwd(), 'src/openapi-auto-generated.json');
  writeFileSync(outputPath, JSON.stringify(spec, null, 2));
  
  console.log('✅ API documentation generated successfully!');
  console.log(`📄 Output: ${outputPath}`);
  console.log(`📊 Endpoints: ${Object.keys(spec.paths || {}).length}`);
  console.log(`📋 Schemas: ${Object.keys(spec.components?.schemas || {}).length}`);
  
} catch (error) {
  console.error('❌ Error generating API documentation:', error);
  process.exit(1);
}

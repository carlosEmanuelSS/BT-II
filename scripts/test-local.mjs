#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Testing Chrome Extension locally...\n');

try {
  // Check if dist directory exists
  if (!fs.existsSync('dist')) {
    console.log('📦 Building extension...');
    execSync('npm run build', { stdio: 'inherit' });
  }

  // Check if Playwright is installed
  console.log('🎭 Installing Playwright browsers...');
  execSync('npx playwright install chromium', { stdio: 'inherit' });

  // Run tests
  console.log('🧪 Running E2E tests...');
  execSync('npm run test:e2e', { stdio: 'inherit' });

  console.log('\n✅ All tests completed successfully!');
  console.log('📊 Check playwright-report/ for detailed results');
  
} catch (error) {
  console.error('\n❌ Test execution failed:', error.message);
  process.exit(1);
}

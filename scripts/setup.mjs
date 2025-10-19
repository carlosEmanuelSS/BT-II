#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Setting up Chrome Extension project...\n');

try {
  // Check Node.js version
  const nodeVersion = process.version;
  console.log(`📦 Node.js version: ${nodeVersion}`);
  
  if (parseInt(nodeVersion.slice(1).split('.')[0]) < 18) {
    console.warn('⚠️  Warning: Node.js 18+ is recommended');
  }

  // Install dependencies
  console.log('📥 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Install Playwright browsers
  console.log('🎭 Installing Playwright browsers...');
  execSync('npx playwright install chromium', { stdio: 'inherit' });

  // Build extension
  console.log('🔨 Building extension...');
  execSync('npm run build', { stdio: 'inherit' });

  // Create test results directory
  if (!fs.existsSync('test-results')) {
    fs.mkdirSync('test-results');
    console.log('📁 Created test-results directory');
  }

  // Create playwright-report directory
  if (!fs.existsSync('playwright-report')) {
    fs.mkdirSync('playwright-report');
    console.log('📁 Created playwright-report directory');
  }

  console.log('\n✅ Setup completed successfully!');
  console.log('\n📋 Available commands:');
  console.log('  npm test           - Run all tests');
  console.log('  npm run test:e2e   - Run E2E tests only');
  console.log('  npm run build      - Build extension');
  console.log('  npm run test:local - Run tests with setup');
  console.log('\n🐳 Docker commands:');
  console.log('  docker compose build        - Build Docker image');
  console.log('  docker compose run --rm e2e - Run tests in Docker');
  console.log('  docker compose -f docker-compose.dev.yml up - Development mode');
  
} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  process.exit(1);
}

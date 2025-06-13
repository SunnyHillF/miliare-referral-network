#!/usr/bin/env tsx

import { Amplify } from 'aws-amplify';
import { seedData } from '../amplify/data/seed';

// This script should be run after deployment to populate test data
async function runSeed() {
  try {
    console.log('🚀 Starting seed script...');
    
    // Set AWS profile to ratediver
    process.env.AWS_PROFILE = 'ratediver';
    console.log('🔧 Using AWS profile: ratediver');
    
    // Configure Amplify with your deployment outputs
    try {
      // Use ES module imports and URL for file path resolution
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      
      // Get current directory in ES modules
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      
      const outputsPath = path.resolve(__dirname, '../amplify_outputs.json');
      if (!fs.existsSync(outputsPath)) {
        throw new Error('amplify_outputs.json not found');
      }
      
      const outputs = JSON.parse(fs.readFileSync(outputsPath, 'utf8'));
      Amplify.configure(outputs);
      console.log('✅ Amplify configured successfully');
  } catch {
    console.error('❌ Failed to load amplify_outputs.json. Make sure you have deployed your app first.');
    console.error('Run: npx ampx sandbox or npx ampx deploy');
      process.exit(1);
    }
    
    await seedData();
    
    console.log('✅ Seed script completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed script failed:', error);
    process.exit(1);
  }
}

// Run the seed function
runSeed(); 
import 'dotenv/config';
import prisma from '../src/db/prisma.js';
import { generateWebsite } from '../src/services/generation.service.js';

async function main() {
  console.log('🌱 Starting Portfolio Seed Generation...');

  try {
    // 1. Get or create test user
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        provider: 'email',
      },
    });

    console.log(`✅ Using User: ${user.email} (ID: ${user.id})`);

    // 2. Clear any previous projects with the same prompt to ensure fresh run
    const prompt = 'create a beautiful dark portfolio of a frontend engineer named Souvik';
    const deleted = await prisma.project.deleteMany({
      where: {
        user_id: user.id,
        prompt: prompt
      }
    });
    if (deleted.count > 0) {
      console.log(`🧹 Cleaned up ${deleted.count} previous generated project(s)`);
    }

    // 3. Generate website
    console.log(`🤖 Generating website portfolio for prompt: "${prompt}"...`);
    console.log('⏳ This uses Gemini and Groq APIs in parallel - please wait...');
    const startTime = Date.now();
    const result = await generateWebsite(prompt, user.id);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n🎉 Generation succeeded in ${duration} seconds!`);
    console.log(`Project ID: ${result.projectId}`);
    console.log(`Project Title: ${result.projectName}`);
    console.log(`Theme: ${result.theme}`);
    console.log('Generated Files:');
    
    Object.keys(result.files).forEach(filename => {
      const codeLen = result.files[filename] ? result.files[filename].length : 0;
      console.log(` - 📁 ${filename} (${codeLen} chars)`);
    });

    console.log('\n✨ Database seeding of the portfolio completed successfully!');
  } catch (error) {
    console.error('❌ Portfolio Seeding failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

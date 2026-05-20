import prisma from '../src/db/prisma.js';
import { generateWebsite } from '../src/services/generation.service.js';

async function main() {
  // Find the first user in the database
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('No user found in database! Please register or run seed first.');
    return;
  }
  
  console.log(`Testing generation for User: ${user.name || user.email} (${user.id})`);
  
  const prompt = "create the portfolio of souvik";
  console.log(`Prompt: "${prompt}"`);
  console.log('Generating website, please wait...');
  
  const start = Date.now();
  try {
    const result = await generateWebsite(prompt, user.id);
    const duration = Date.now() - start;
    
    console.log('\n--- GENERATION SUCCESS ---');
    console.log(`Time taken: ${(duration / 1000).toFixed(2)} seconds`);
    console.log(`Project ID: ${result.projectId}`);
    console.log(`Project Name: ${result.projectName}`);
    console.log('Files generated:');
    Object.entries(result.files).forEach(([name, content]) => {
      console.log(`  - ${name} (${content.length} characters)`);
    });
  } catch (error) {
    console.error('\n--- GENERATION FAILED ---');
    console.error(error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

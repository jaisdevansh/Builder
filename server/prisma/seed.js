import prisma from '../src/db/prisma.js';

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // Create a test user
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        provider: 'email',
      },
    });

    console.log(`✅ User created/found: ${user.email}`);

    // Create a test project
    const project = await prisma.project.create({
      data: {
        user_id: user.id,
        title: 'Test Project',
        prompt: 'Create a simple landing page for a coffee shop',
        theme: 'dark',
      },
    });

    console.log(`✅ Project created: ${project.title}`);
    
    // Create a test file for the project
    await prisma.generatedFile.create({
      data: {
        project_id: project.id,
        file_name: 'index.html',
        file_type: 'html',
        content: '<h1>Welcome to the Coffee Shop</h1>',
      }
    });
    
    console.log('✅ Generated file created');
    console.log('✨ Seeding completed successfully!');

  } catch (error) {
    console.error('❌ Seeding failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

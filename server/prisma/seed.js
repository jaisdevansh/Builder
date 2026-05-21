import prisma from '../src/db/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create a dummy user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@builder.test' },
    update: {},
    create: {
      email: 'demo@builder.test',
      name: 'Demo User',
      password: hashedPassword,
      provider: 'email',
    },
  });

  console.log(`✅ Created Demo User: ${user.email} (Password: password123)`);

  // 2. Create a dummy project for them so they have something in their dashboard
  const project = await prisma.project.create({
    data: {
      user_id: user.id,
      title: 'My First AI Website',
      prompt: 'Build a sleek, modern portfolio for a developer.',
      theme: 'dark',
      files: {
        create: [
          {
            file_name: 'App.tsx',
            file_type: 'tsx',
            content: `import React from 'react';
export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Hello, Builder!</h1>
        <p className="mt-4 text-zinc-400">This is a seeded demo project.</p>
      </div>
    </div>
  );
}`
          },
          {
            file_name: 'styles.css',
            file_type: 'css',
            content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;`
          }
        ]
      }
    }
  });

  console.log(`✅ Created Demo Project: ${project.title}`);
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

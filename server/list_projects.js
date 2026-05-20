import prisma from './src/db/prisma.js';

async function main() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
      prompt: true
    }
  });
  console.log('PROJECTS IN DATABASE:');
  projects.forEach(p => {
    console.log(`ID: ${p.id} | Title: ${p.title} | Prompt: ${p.prompt}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

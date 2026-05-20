import prisma from './src/db/prisma.js';

async function main() {
  const p = await prisma.project.findMany({
    include: { files: true }
  });
  if (p.length > 0) {
    console.log('Projects found:', p.length);
    p.forEach(proj => {
      console.log('Project ID:', proj.id);
      console.log('Project Title:', proj.title);
      console.log('Files count:', proj.files.length);
      console.log('Files:', proj.files.map(f => f.file_name));
    });
  } else {
    console.log('No projects found');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

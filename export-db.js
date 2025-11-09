const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

(async () => {
  try {
    const [resume, projects] = await Promise.all([
      prisma.resume.findMany(),
      prisma.project.findMany()
    ]);
    
    const data = { resume, projects };
    fs.writeFileSync('db-export.json', JSON.stringify(data, null, 2));
    console.log('Data exported successfully!');
    console.log('Resume entries:', resume.length);
    console.log('Projects:', projects.length);
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
})();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed Resume Data
  console.log('📝 Seeding resume data...');
  await prisma.resume.createMany({
    data: [
      {
        section: 'Education',
        title: 'BSIT-4 | Saint Paul University Philippines',
        description: 'Majoring in Website Development, Currently taking Full Stack Development. Focused on modern web technologies and AI integration.',
        dateRange: '2021 - 2025',
        order: 1,
      },
      {
        section: 'Skills',
        title: 'Frontend Development',
        description: 'HTML5, CSS3, JavaScript, TypeScript, React, Next.js, Tailwind CSS, Responsive Design',
        dateRange: 'Current',
        order: 1,
      },
      {
        section: 'Skills',
        title: 'Backend Development',
        description: 'Node.js, Express, Prisma ORM, MySQL, PostgreSQL, RESTful APIs, Authentication',
        dateRange: 'Current',
        order: 2,
      },
      {
        section: 'Skills',
        title: 'Tools & Technologies',
        description: 'Git, GitHub, Docker, Vercel, VS Code, Figma, Postman, AI/ML Integration',
        dateRange: 'Current',
        order: 3,
      },
      {
        section: 'Experience',
        title: 'Full Stack Development Intern',
        description: 'Developed and maintained web applications using Next.js and MySQL. Implemented AI features using OpenAI API.',
        dateRange: '2024 - Present',
        order: 1,
      },
      {
        section: 'Certifications',
        title: 'Full Stack Web Development',
        description: 'Completed comprehensive course covering frontend and backend technologies',
        dateRange: '2024',
        order: 1,
      },
    ],
  });

  // Seed Projects
  console.log('🚀 Seeding projects...');
  await prisma.project.createMany({
    data: [
      {
        title: 'Portfolio & Resume System with AI',
        description: 'A comprehensive portfolio website featuring an AI-powered digital twin and dynamic resume management. Built with Next.js and OpenAI API.',
        techStack: 'Next.js, TypeScript, Tailwind CSS, MySQL, Prisma, OpenAI',
        githubLink: 'https://github.com/username/portfolio',
        demoLink: 'https://portfolio-demo.vercel.app',
        featured: true,
      },
      {
        title: 'E-Commerce Platform',
        description: 'Full-featured e-commerce solution with product management, shopping cart, payment integration, and order tracking.',
        techStack: 'Next.js, Prisma, MySQL, Stripe, Redux',
        githubLink: 'https://github.com/username/ecommerce',
        featured: true,
      },
      {
        title: 'Task Management App',
        description: 'Collaborative task management application with real-time updates, team collaboration features, and project tracking.',
        techStack: 'React, Node.js, Express, MongoDB, Socket.io',
        githubLink: 'https://github.com/username/task-manager',
        demoLink: 'https://task-manager-demo.vercel.app',
        featured: false,
      },
      {
        title: 'Weather Dashboard',
        description: 'Interactive weather dashboard with real-time weather data, forecasts, and beautiful visualizations using weather APIs.',
        techStack: 'Next.js, TypeScript, Chart.js, OpenWeather API',
        githubLink: 'https://github.com/username/weather-dashboard',
        demoLink: 'https://weather-demo.vercel.app',
        featured: false,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

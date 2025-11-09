const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: 'https://charming-worm-29217.upstash.io',
  token: 'AXIhAAIncDIxNjc5ZDU2NzNmMmI0NmQ2OGEyNWMxZDAzZTVmZWNjMHAyMjkyMTc',
});

// Sample resume data
const resumeData = [
  // Education
  {
    id: 1,
    section: 'education',
    title: 'Bachelor of Science in Information Technology',
    description: 'Major in Web Development and Database Systems. Relevant coursework: Full-Stack Development, Database Management, Software Engineering, Algorithms and Data Structures.',
    dateRange: '2021 - Present',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Experience
  {
    id: 2,
    section: 'experience',
    title: 'Full-Stack Developer Intern',
    description: 'Developed and maintained web applications using React, Next.js, and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions. Implemented responsive designs and optimized application performance.',
    dateRange: '2023 - 2024',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    section: 'experience',
    title: 'Freelance Web Developer',
    description: 'Built custom websites and web applications for small businesses and startups. Managed projects from initial consultation through deployment. Technologies: React, Next.js, MySQL, MongoDB, TailwindCSS.',
    dateRange: '2022 - Present',
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Skills
  {
    id: 4,
    section: 'skills',
    title: 'Frontend Development',
    description: 'React, Next.js, TypeScript, JavaScript, HTML5, CSS3, TailwindCSS, Responsive Design, UI/UX Implementation',
    dateRange: 'Expert Level',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    section: 'skills',
    title: 'Backend Development',
    description: 'Node.js, Express.js, REST APIs, GraphQL, API Design, Microservices Architecture',
    dateRange: 'Advanced Level',
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    section: 'skills',
    title: 'Database Management',
    description: 'MySQL, PostgreSQL, MongoDB, Redis, Prisma ORM, Database Design, Query Optimization',
    dateRange: 'Advanced Level',
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 7,
    section: 'skills',
    title: 'AI & Machine Learning',
    description: 'OpenAI API Integration, Natural Language Processing, Prompt Engineering, AI Chatbots, Voice AI Systems',
    dateRange: 'Intermediate Level',
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Certifications
  {
    id: 8,
    section: 'certifications',
    title: 'Full-Stack Web Development',
    description: 'Comprehensive certification in modern web development technologies and best practices',
    dateRange: '2023',
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 9,
    section: 'certifications',
    title: 'React & Next.js Mastery',
    description: 'Advanced certification in React ecosystem and Next.js framework',
    dateRange: '2024',
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Sample projects data
const projectsData = [
  {
    id: 1,
    title: 'AI-Powered Portfolio with Digital Twin',
    description: 'A cutting-edge portfolio website featuring an AI Digital Twin powered by OpenAI. The Digital Twin can answer questions about skills, experience, and projects through both voice and chat interfaces. Built with Next.js 14, TypeScript, and integrated with MySQL database for dynamic content management.',
    techStack: 'Next.js, React, TypeScript, TailwindCSS, OpenAI API, MySQL, Prisma, Web Speech API',
    githubLink: 'https://github.com/renktt/rresume',
    demoLink: 'https://rresume.vercel.app',
    imageUrl: '/projects/portfolio.jpg',
    featured: true,
    createdAt: new Date('2024-11-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce platform with user authentication, product management, shopping cart, and payment integration. Features include real-time inventory tracking, order management, and admin dashboard.',
    techStack: 'Next.js, Node.js, MongoDB, Stripe API, TailwindCSS, NextAuth',
    githubLink: 'https://github.com/renktt/ecommerce',
    demoLink: 'https://demo-ecommerce.vercel.app',
    imageUrl: '/projects/ecommerce.jpg',
    featured: true,
    createdAt: new Date('2024-09-15').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Task Management System',
    description: 'Collaborative task management application with real-time updates, team workspaces, and project tracking. Features drag-and-drop task boards, deadline reminders, and productivity analytics.',
    techStack: 'React, Node.js, Express, PostgreSQL, Socket.io, Material-UI',
    githubLink: 'https://github.com/renktt/task-manager',
    demoLink: 'https://tasks-demo.vercel.app',
    imageUrl: '/projects/task-manager.jpg',
    featured: false,
    createdAt: new Date('2024-07-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Weather Dashboard',
    description: 'Interactive weather application providing real-time weather data, forecasts, and historical trends. Features location-based weather, multiple city tracking, and responsive visualizations.',
    techStack: 'React, TypeScript, OpenWeather API, Chart.js, TailwindCSS',
    githubLink: 'https://github.com/renktt/weather-app',
    demoLink: 'https://weather-dashboard-demo.vercel.app',
    imageUrl: '/projects/weather.jpg',
    featured: false,
    createdAt: new Date('2024-05-10').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: 'Blog Platform with CMS',
    description: 'Modern blogging platform with custom Content Management System. Features include markdown editor, tag system, comment functionality, and SEO optimization.',
    techStack: 'Next.js, MDX, PostgreSQL, TailwindCSS, Vercel',
    githubLink: 'https://github.com/renktt/blog-cms',
    demoLink: 'https://blog-demo.vercel.app',
    imageUrl: '/projects/blog.jpg',
    featured: false,
    createdAt: new Date('2024-03-05').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seedRedis() {
  try {
    console.log('Starting Redis data seeding...\n');

    // Seed resume data
    console.log('Seeding resume data...');
    await redis.set('resume:data', resumeData);
    console.log(`✅ Seeded ${resumeData.length} resume entries`);

    // Seed projects data
    console.log('Seeding projects data...');
    await redis.set('projects:data', projectsData);
    console.log(`✅ Seeded ${projectsData.length} projects`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nData Summary:');
    console.log(`- Education: ${resumeData.filter(r => r.section === 'education').length} entries`);
    console.log(`- Experience: ${resumeData.filter(r => r.section === 'experience').length} entries`);
    console.log(`- Skills: ${resumeData.filter(r => r.section === 'skills').length} entries`);
    console.log(`- Certifications: ${resumeData.filter(r => r.section === 'certifications').length} entries`);
    console.log(`- Projects: ${projectsData.length} entries`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedRedis();

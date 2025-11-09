const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: 'https://charming-worm-29217.upstash.io',
  token: 'AXIhAAIncDIxNjc5ZDU2NzNmMmI0NmQ2OGEyNWMxZDAzZTVmZWNjMHAyMjkyMTc',
});

async function addNewContent() {
  try {
    console.log('Adding new content to Redis...\n');

    // Get existing data
    const existingResume = await redis.get('resume:data') || [];
    const existingProjects = await redis.get('projects:data') || [];

    // Add HTML/CSS Certification
    const htmlCssCert = {
      id: existingResume.length + 1,
      section: 'certifications',
      title: 'HTML & CSS Certification',
      description: 'Certified in HTML5 and CSS3 fundamentals, responsive design, and modern web development best practices',
      dateRange: '2024',
      order: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add additional skills
    const additionalSkills = [
      {
        id: existingResume.length + 2,
        section: 'skills',
        title: 'Web Development Fundamentals',
        description: 'HTML5, CSS3, Responsive Design, Web Accessibility, Semantic HTML, CSS Grid, Flexbox, CSS Animations',
        dateRange: 'Expert Level',
        order: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: existingResume.length + 3,
        section: 'skills',
        title: 'System Design & Architecture',
        description: 'Database Design, System Architecture, Decision Support Systems, Data Modeling, ERD Design',
        dateRange: 'Advanced Level',
        order: 6,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ];

    // Add Club and Organization Management System project
    const clubManagementProject = {
      id: existingProjects.length + 1,
      title: 'Club and Organization Management System with Decision Support',
      description: 'Comprehensive management system for clubs and organizations featuring member management, event scheduling, resource allocation, and integrated decision support system. Includes analytics dashboard, automated reporting, and data-driven insights for organizational decision-making.',
      techStack: 'PHP, MySQL, JavaScript, Bootstrap, Chart.js, Decision Support Algorithms',
      githubLink: 'https://github.com/renktt/club-management',
      demoLink: null,
      imageUrl: '/projects/club-management.jpg',
      featured: true,
      createdAt: new Date('2024-08-15').toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add Digital Twin Resume System project (currently in development)
    const digitalTwinProject = {
      id: existingProjects.length + 2,
      title: 'AI-Powered Digital Twin Resume System',
      description: 'Advanced portfolio system with AI Digital Twin powered by Groq AI (LLaMA 3.1) and Upstash Redis. Features intelligent chatbot and voice assistant that can answer questions about skills, experience, and projects. Includes real-time data integration, conversation memory, and context-aware responses. Currently in active development.',
      techStack: 'Next.js, React, TypeScript, Groq AI, Upstash Redis, TailwindCSS, Web Speech API',
      githubLink: 'https://github.com/renktt/rresume',
      demoLink: 'https://rresume.vercel.app',
      imageUrl: '/projects/digital-twin.jpg',
      featured: true,
      createdAt: new Date('2024-10-01').toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update resume data
    const updatedResume = [...existingResume, htmlCssCert, ...additionalSkills];
    await redis.set('resume:data', updatedResume);
    console.log('✅ Added HTML/CSS certification and additional skills');

    // Update projects data
    const updatedProjects = [...existingProjects, clubManagementProject, digitalTwinProject];
    await redis.set('projects:data', updatedProjects);
    console.log('✅ Added Club Management System and Digital Twin Resume System projects');

    console.log('\n🎉 Content update completed successfully!');
    console.log('\nNew Content Summary:');
    console.log('- Certifications: HTML & CSS Certification (2024)');
    console.log('- Skills: Web Development Fundamentals (HTML5, CSS3, Responsive Design)');
    console.log('- Skills: System Design & Architecture (Database Design, Decision Support)');
    console.log('- Projects: Club and Organization Management System with Decision Support');
    console.log('- Projects: AI-Powered Digital Twin Resume System (In Development)');
    console.log(`\nTotal Resume Entries: ${updatedResume.length}`);
    console.log(`Total Projects: ${updatedProjects.length}`);
    
  } catch (error) {
    console.error('❌ Error updating content:', error);
    process.exit(1);
  }
}

addNewContent();

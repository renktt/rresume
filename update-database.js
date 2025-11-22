/**
 * Script to clear existing database and add new resume content
 */
const { Index } = require('@upstash/vector');

// Initialize Upstash Vector client
const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

// Simple vector creation function
function createSimpleVector(text) {
  const dimension = 1536;
  const vector = new Array(dimension).fill(0);
  
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const index = (charCode * i) % dimension;
    vector[index] += charCode / 1000;
  }
  
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => magnitude > 0 ? val / magnitude : 0);
}

async function clearDatabase() {
  console.log('🗑️  Clearing existing database...');
  
  try {
    // Fetch all existing vectors
    const allData = await vectorIndex.range({ cursor: '0', limit: 1000, includeMetadata: true });
    
    if (allData && allData.vectors && allData.vectors.length > 0) {
      console.log(`Found ${allData.vectors.length} vectors to delete`);
      
      // Delete all vectors
      const deletePromises = allData.vectors.map(v => vectorIndex.delete(v.id));
      await Promise.all(deletePromises);
      
      console.log('✅ Database cleared successfully');
    } else {
      console.log('Database is already empty');
    }
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}

async function addNewContent() {
  console.log('\n📝 Adding new resume content...');
  
  const now = new Date().toISOString();
  
  // New content structure
  const resumeData = [
    // Certification
    {
      id: 'resume-cert-1',
      section: 'certification',
      title: 'HTML & CSS Certificate',
      description: 'Completed certification in HTML & CSS web development fundamentals',
      dateRange: '2025',
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
    
    // Education
    {
      id: 'resume-edu-1',
      section: 'education',
      title: 'Bachelor of Science in Information Technology',
      description: 'Comprehensive study in information technology, software development, and computer systems',
      dateRange: '2021 - 2025',
      order: 2,
      createdAt: now,
      updatedAt: now,
    },
    
    // Experience
    {
      id: 'resume-exp-1',
      section: 'experience',
      title: 'Full-stack & Agentic AI Industry Project Internship',
      description: 'Working on full-stack development projects and agentic AI systems in real-world industry settings',
      dateRange: 'Currently',
      order: 3,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'resume-exp-2',
      section: 'experience',
      title: 'Freelance Web Development',
      description: 'Providing web development services to clients, building custom websites and web applications',
      dateRange: '2025',
      order: 4,
      createdAt: now,
      updatedAt: now,
    },
    
    // Skills
    {
      id: 'resume-skill-1',
      section: 'skills',
      title: 'Website Development',
      description: 'Proficient in creating modern, responsive websites using latest technologies',
      dateRange: '',
      order: 5,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'resume-skill-2',
      section: 'skills',
      title: 'Database Management',
      description: 'Experienced in designing and managing relational and NoSQL databases',
      dateRange: '',
      order: 6,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'resume-skill-3',
      section: 'skills',
      title: 'AI & Machine Learning',
      description: 'Knowledge in artificial intelligence, machine learning models, and AI-powered applications',
      dateRange: '',
      order: 7,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'resume-skill-4',
      section: 'skills',
      title: 'Front-End Development',
      description: 'Expert in React, Next.js, TypeScript, and modern frontend frameworks',
      dateRange: '',
      order: 8,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'resume-skill-5',
      section: 'skills',
      title: 'Back-End Development',
      description: 'Skilled in Node.js, API development, and server-side programming',
      dateRange: '',
      order: 9,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'resume-skill-6',
      section: 'skills',
      title: 'System Design and Architecture',
      description: 'Understanding of software architecture patterns, system design, and scalable solutions',
      dateRange: '',
      order: 10,
      createdAt: now,
      updatedAt: now,
    },
  ];
  
  const projectsData = [
    {
      id: 'project-1',
      title: 'E-commerce Platform',
      description: 'A full-featured e-commerce platform with shopping cart, payment integration, and order management',
      techStack: 'Next.js, React, TypeScript, Tailwind CSS, Stripe, PostgreSQL',
      githubLink: '',
      demoLink: null,
      imageUrl: '/images/ecommerce.jpg',
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'project-2',
      title: 'Club and Organization Management System with Decision Support',
      description: 'Comprehensive management system for clubs and organizations featuring member management, event scheduling, and data-driven decision support tools',
      techStack: 'Next.js, React, TypeScript, MySQL, Node.js, Chart.js',
      githubLink: '',
      demoLink: null,
      imageUrl: '/images/club-management.jpg',
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'project-3',
      title: 'AI-Powered Digital Twin Resume System',
      description: 'An intelligent resume system powered by AI that acts as a digital twin, featuring RAG (Retrieval-Augmented Generation) for context-aware responses and interactive chat',
      techStack: 'Next.js, TypeScript, Groq AI, Upstash Vector Database, RAG System, Voice AI',
      githubLink: 'https://github.com/renktt/rresume',
      demoLink: null,
      imageUrl: '/images/digital-twin.jpg',
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
  
  // Insert resume data
  console.log('Adding resume items...');
  for (const item of resumeData) {
    const text = `${item.section} ${item.title} ${item.description} ${item.dateRange}`;
    const vector = createSimpleVector(text);
    
    await vectorIndex.upsert({
      id: item.id,
      vector,
      metadata: item,
    });
    
    console.log(`✓ Added: ${item.section} - ${item.title}`);
  }
  
  // Insert projects data
  console.log('\nAdding projects...');
  for (const project of projectsData) {
    const text = `${project.title} ${project.description} ${project.techStack}`;
    const vector = createSimpleVector(text);
    
    await vectorIndex.upsert({
      id: project.id,
      vector,
      metadata: project,
    });
    
    console.log(`✓ Added: ${project.title}`);
  }
  
  console.log('\n✅ All new content added successfully!');
  console.log(`\nSummary:`);
  console.log(`- Resume items: ${resumeData.length}`);
  console.log(`- Projects: ${projectsData.length}`);
  console.log(`- Total vectors: ${resumeData.length + projectsData.length}`);
}

async function main() {
  try {
    console.log('🚀 Starting database update...\n');
    
    // Step 1: Clear existing data
    await clearDatabase();
    
    // Step 2: Add new content
    await addNewContent();
    
    console.log('\n🎉 Database update completed successfully!');
  } catch (error) {
    console.error('\n❌ Error updating database:', error);
    process.exit(1);
  }
}

// Run the script
main();

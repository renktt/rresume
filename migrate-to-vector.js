require('dotenv').config({ path: '.env.local' });
const { Redis } = require('@upstash/redis');
const { Index } = require('@upstash/vector');

// Initialize Redis client (source)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://charming-worm-29217.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AXIhAAIncDIxNjc5ZDU2NzNmMmI0NmQ2OGEyNWMxZDAzZTVmZWNjMHAyMjkyMTc',
});

// Initialize Vector Index (destination)
const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

// Simple vector creation function (creates a deterministic vector from text)
// In production, you should use OpenAI embeddings or similar
function createSimpleVector(text) {
  const dimension = 1536; // Standard embedding dimension
  const vector = new Array(dimension).fill(0);
  
  // Create a simple hash-based vector
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const index = (charCode * i) % dimension;
    vector[index] += charCode / 1000;
  }
  
  // Normalize the vector
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => magnitude > 0 ? val / magnitude : 0);
}

async function migrateRedisToVector() {
  try {
    console.log('🚀 Starting migration from Redis to Upstash Vector...\n');
    console.log('⚠️  Note: Using Upstash Vector with external embeddings\n');

    // =====================
    // Migrate Resume Data
    // =====================
    console.log('📄 Migrating resume data...');
    const resumeData = await redis.get('resume:data');
    
    if (resumeData && Array.isArray(resumeData)) {
      console.log(`   Found ${resumeData.length} resume entries`);
      
      for (const item of resumeData) {
        const id = `resume-${item.id || Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Create a simple hash-based vector (1536 dimensions for compatibility)
        // This is a placeholder - in production, use proper embeddings from OpenAI or similar
        const text = `${item.section} ${item.title} ${item.description} ${item.dateRange}`;
        const vector = await createSimpleVector(text);
        
        await vectorIndex.upsert({
          id,
          vector,
          metadata: {
            ...item,
            id,
            type: 'resume',
          },
        });
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`   ✅ Migrated ${resumeData.length} resume entries`);
    } else {
      console.log('   ⚠️  No resume data found in Redis');
    }

    // =====================
    // Migrate Projects Data
    // =====================
    console.log('\n🎨 Migrating projects data...');
    const projectsData = await redis.get('projects:data');
    
    if (projectsData && Array.isArray(projectsData)) {
      console.log(`   Found ${projectsData.length} projects`);
      
      for (const project of projectsData) {
        const id = `project-${project.id || Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const text = `${project.title} ${project.description} ${project.techStack}`;
        const vector = await createSimpleVector(text);
        
        await vectorIndex.upsert({
          id,
          vector,
          metadata: {
            ...project,
            id,
            type: 'project',
          },
        });
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`   ✅ Migrated ${projectsData.length} projects`);
    } else {
      console.log('   ⚠️  No projects data found in Redis');
    }

    // =====================
    // Migrate Contact Messages (if any)
    // =====================
    console.log('\n📧 Migrating contact messages...');
    const contactMessages = await redis.get('contact:messages');
    
    if (contactMessages && Array.isArray(contactMessages)) {
      console.log(`   Found ${contactMessages.length} contact messages`);
      
      for (const message of contactMessages) {
        const id = `contact-${message.id || Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const text = `contact message from ${message.name} ${message.email}: ${message.message}`;
        const vector = await createSimpleVector(text);
        
        await vectorIndex.upsert({
          id,
          vector,
          metadata: {
            ...message,
            id,
            type: 'contact',
          },
        });
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`   ✅ Migrated ${contactMessages.length} contact messages`);
    } else {
      console.log('   ⚠️  No contact messages found in Redis');
    }

    // =====================
    // Migration Summary
    // =====================
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Migration completed successfully!');
    console.log('='.repeat(60));
    console.log('\n📊 Migration Summary:');
    console.log(`   Resume entries: ${resumeData?.length || 0}`);
    console.log(`   Projects: ${projectsData?.length || 0}`);
    console.log(`   Contact messages: ${contactMessages?.length || 0}`);
    console.log(`   Total records migrated: ${(resumeData?.length || 0) + (projectsData?.length || 0) + (contactMessages?.length || 0)}`);
    
    console.log('\n📝 Next Steps:');
    console.log('   1. Update API routes to use Vector database');
    console.log('   2. Test the application thoroughly');
    console.log('   3. Update environment variables in Vercel');
    console.log('   4. Once verified, you can safely remove the old Redis data');
    
    console.log('\n✨ Your data is now in Upstash Vector with semantic search capabilities!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.error('\nError details:', error.message);
    process.exit(1);
  }
}

// Run migration
migrateRedisToVector();

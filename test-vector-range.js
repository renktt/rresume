const { Index } = require('@upstash/vector');
require('dotenv').config({ path: '.env.local' });

const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

async function testRange() {
  try {
    console.log('Testing Upstash Vector range()...\n');
    
    // Try with includeMetadata option
    const result = await vectorIndex.range({ 
      cursor: '0', 
      limit: 10,
      includeMetadata: true 
    });
    
    console.log('Total vectors:', result.vectors?.length || 0);
    console.log('Next cursor:', result.nextCursor);
    
    if (result.vectors && result.vectors.length > 0) {
      console.log('\nFirst vector sample:');
      console.log('ID:', result.vectors[0].id);
      console.log('Metadata keys:', Object.keys(result.vectors[0].metadata || {}));
      console.log('Metadata:', JSON.stringify(result.vectors[0].metadata, null, 2));
    } else {
      console.log('\nNo vectors found!');
      console.log('Full result:', JSON.stringify(result, null, 2));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testRange();

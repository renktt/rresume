const { Index } = require('@upstash/vector');
require('dotenv').config({ path: '.env.local' });

const vectorIndex = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

async function testRange() {
  try {
    console.log('Testing range...');
    const result = await vectorIndex.range({ cursor: '0', limit: 10 });
    console.log('Range result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testRange();

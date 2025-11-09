// Quick test script for chat API
const http = require('http');

const data = JSON.stringify({
  message: 'hello',
  sessionId: 'test-123'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/ai/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  
  console.log(`Status Code: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', body);
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
  process.exit(1);
});

req.write(data);
req.end();

// Timeout after 30 seconds
setTimeout(() => {
  console.error('Test timed out');
  process.exit(1);
}, 30000);

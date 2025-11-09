# Migration to Upstash Vector Database

This guide will help you migrate your portfolio data from Upstash Redis to Upstash Vector database with semantic search capabilities.

## What Changed

### Before (Redis)
- Simple key-value storage
- Manual data retrieval
- No semantic search

### After (Vector Database)
- AI-powered semantic search
- Vector embeddings for intelligent data retrieval
- Better AI context understanding
- More efficient data queries

## Benefits of Vector Database

1. **Semantic Search**: Find relevant content based on meaning, not just keywords
2. **Better AI Responses**: The AI can find more relevant information from your resume/projects
3. **Scalable**: Handle growing amounts of data efficiently
4. **Smart Filtering**: Automatically retrieve the most relevant information

## Step-by-Step Migration Guide

### Step 1: Create Upstash Vector Database

1. Go to [Upstash Console](https://console.upstash.com)
2. Navigate to **Vector** section
3. Click **Create Index**
4. Configure your index:
   - **Name**: `resume-vector-db` (or any name you prefer)
   - **Dimension**: `1536` (for text embeddings)
   - **Metric**: `COSINE` (recommended for text similarity)
   - **Region**: Choose closest to your users
5. Click **Create**

### Step 2: Get API Credentials

After creating the index:
1. Click on your newly created index
2. Copy the following credentials:
   - **UPSTASH_VECTOR_REST_URL**
   - **UPSTASH_VECTOR_REST_TOKEN**

### Step 3: Update Environment Variables

#### Local Development (.env.local)
```bash
# Upstash Vector Configuration
UPSTASH_VECTOR_REST_URL="your_vector_url_here"
UPSTASH_VECTOR_REST_TOKEN="your_vector_token_here"
```

#### Vercel Deployment
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `UPSTASH_VECTOR_REST_URL`: Your vector URL
   - `UPSTASH_VECTOR_REST_TOKEN`: Your vector token
4. Click **Save**

### Step 4: Run Migration Script

```bash
# Make sure your Redis credentials are in .env.local
# The script will read from Redis and write to Vector

node migrate-to-vector.js
```

The script will:
- ✅ Read all resume data from Redis
- ✅ Read all projects from Redis
- ✅ Read all contact messages from Redis
- ✅ Convert data to vector embeddings
- ✅ Upload to Upstash Vector
- ✅ Verify migration success

### Step 5: Test the Application

```bash
# Start the development server
npm run dev
```

Test the following:
1. **Resume Section**: Should display all education, skills, experience, certifications
2. **Projects Section**: Should show all your projects
3. **AI Chatbot**: Ask questions about your skills and projects
4. **Voice Assistant**: Test voice interactions
5. **Contact Form**: Try submitting a test message

### Step 6: Build and Deploy

```bash
# Build for production
npm run build

# If build succeeds, commit and push
git add .
git commit -m "Migrate to Upstash Vector database with semantic search"
git push origin main
```

## Verification Checklist

- [ ] Upstash Vector index created
- [ ] Environment variables added to .env.local
- [ ] Migration script executed successfully
- [ ] Resume data displays correctly (15 entries)
- [ ] Projects display correctly (9 projects)
- [ ] AI chatbot responds with accurate information
- [ ] Voice assistant works properly
- [ ] Contact form submissions save correctly
- [ ] Production build succeeds
- [ ] Vercel environment variables updated
- [ ] Application deployed and working on Vercel

## New Features Enabled

### Semantic Search API
The Vector database enables a new semantic search endpoint:

```typescript
// Example: Search for relevant skills
const results = await vectorHelpers.semanticSearch('web development experience', 10);

// Returns the most relevant resume items and projects
// based on semantic meaning, not just keyword matching
```

### Better AI Responses
The AI now retrieves more contextually relevant information:
- Asks about "frontend skills" → finds React, Next.js, TypeScript
- Asks about "database work" → finds MySQL, Redis, MongoDB projects
- Asks about "recent projects" → intelligently finds latest work

## Troubleshooting

### Migration Script Fails
```bash
# Check Redis connection
node -e "const {Redis} = require('@upstash/redis'); const r = new Redis({url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN}); r.ping().then(console.log)"

# Check Vector connection
node -e "const {Index} = require('@upstash/vector'); const i = new Index({url: process.env.UPSTASH_VECTOR_REST_URL, token: process.env.UPSTASH_VECTOR_REST_TOKEN}); i.info().then(console.log)"
```

### Data Not Showing After Migration
1. Check that migration script completed without errors
2. Verify environment variables are set correctly
3. Restart the development server
4. Check browser console for API errors

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
npm install

# Try building again
npm run build
```

## Data Structure in Vector DB

Each record is stored with:
- **ID**: Unique identifier (e.g., `resume-1234567890-abc123`)
- **Embedding**: Vector representation of the text content
- **Metadata**: All original data fields (title, description, etc.)
- **Type**: Category tag (`resume`, `project`, `contact`)

## Rollback Plan (If Needed)

If you need to rollback to Redis:

1. Restore imports in API routes:
```typescript
// Change this:
import { vectorHelpers } from '@/lib/vector';

// Back to this:
import { redisHelpers } from '@/lib/redis';
```

2. Replace all `vectorHelpers` calls with `redisHelpers`
3. Remove Vector environment variables
4. Rebuild and redeploy

Note: Your Redis data is still intact and hasn't been deleted!

## Cost Comparison

**Redis**: $0.20/GB per month
**Vector**: $0.40/GB per month + $0.40 per 100k queries

For a portfolio with ~50-100 records:
- Storage: ~1MB = negligible cost
- Queries: ~1000/month = ~$0.01
- **Total**: Less than $1/month

## Support

If you encounter issues:
1. Check [Upstash Vector Docs](https://upstash.com/docs/vector)
2. Review migration logs for errors
3. Test individual API endpoints
4. Verify environment variables

---

**Migration Status**: ⏳ Ready to migrate
**Next Step**: Create Upstash Vector index and add credentials to .env.local

# Deployment Guide

## Prerequisites
- GitHub account
- Vercel account
- MySQL database (PlanetScale/Railway recommended)
- OpenAI API key with credits

## Step-by-Step Deployment

### 1. Prepare Your Repository

\`\`\`powershell
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Portfolio with AI digital twin"

# Create repository on GitHub and push
git remote add origin https://github.com/yourusername/portfolio.git
git branch -M main
git push -u origin main
\`\`\`

### 2. Setup Production Database

#### Option A: PlanetScale (Recommended)

1. Sign up at https://planetscale.com
2. Create new database: \`portfolio-prod\`
3. Click "Connect" and copy connection string
4. Format: \`mysql://user:pass@host/dbname?sslaccept=strict\`

#### Option B: Railway

1. Sign up at https://railway.app
2. New Project → Add MySQL
3. Copy connection string from Variables tab

### 3. Deploy to Vercel

1. Go to https://vercel.com
2. Click "Import Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: \`npm run build\`
   - Output Directory: .next

### 4. Add Environment Variables in Vercel

In your Vercel project settings, add:

\`\`\`
DATABASE_URL=mysql://user:pass@host/dbname?sslaccept=strict
OPENAI_API_KEY=sk-your-openai-api-key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
\`\`\`

**Important:** Don't wrap values in quotes in Vercel dashboard.

### 5. Setup Database Schema

After first deployment, run these commands locally connected to production:

\`\`\`powershell
# Set production DATABASE_URL temporarily
$env:DATABASE_URL="your-production-database-url"

# Push schema
npm run prisma:push

# Seed data (optional)
npm run seed

# Clear environment variable
Remove-Item Env:DATABASE_URL
\`\`\`

### 6. Verify Deployment

1. Visit your Vercel URL
2. Test all pages:
   - About Me (with AI greeting)
   - Resume (PDF download)
   - Projects
   - LMS
   - Contact (form submission)
3. Test Voice AI on each page
4. Test dark mode toggle
5. Test responsive design on mobile

### 7. Custom Domain (Optional)

In Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update \`NEXT_PUBLIC_APP_URL\` environment variable

## Post-Deployment

### Monitor Performance
- Check Vercel Analytics
- Monitor API usage on OpenAI dashboard
- Check database performance on PlanetScale/Railway

### Update Content
Use Prisma Studio locally:
\`\`\`powershell
$env:DATABASE_URL="your-production-database-url"
npm run prisma:studio
\`\`\`

Or build an admin panel (future enhancement).

### Continuous Deployment
- Push to \`main\` branch → Auto-deploys to Vercel
- Use preview deployments for testing

## Troubleshooting

### Build Fails
- Check build logs in Vercel
- Ensure all environment variables are set
- Verify DATABASE_URL format

### Database Connection Issues
- Verify connection string format
- Check database is accessible (not localhost)
- For PlanetScale: ensure \`?sslaccept=strict\` is in URL

### OpenAI API Errors
- Verify API key is correct
- Check you have credits available
- Monitor rate limits

### Voice AI Not Working
- Ensure HTTPS (required for microphone access)
- Check browser compatibility
- Verify OpenAI API key

## Security Checklist

- ✅ Environment variables not in code
- ✅ API routes validate inputs
- ✅ Database credentials secure
- ✅ HTTPS enabled (automatic on Vercel)
- ✅ CORS configured properly
- ✅ Rate limiting considered (add if needed)

## Cost Considerations

**Free Tier Limits:**
- Vercel: 100GB bandwidth/month
- PlanetScale: 5GB storage, 1 billion rows read/month
- OpenAI: Pay per use (~$0.002 per 1K tokens)

**Recommendations:**
- Start with free tiers
- Monitor usage
- Implement caching for OpenAI responses
- Add rate limiting to prevent abuse

## Backup Strategy

### Database Backups
- PlanetScale: Automatic daily backups
- Railway: Manual exports recommended

### Code Backups
- GitHub repository (already done)
- Tag releases: \`git tag v1.0.0\`

## Updating Production

\`\`\`powershell
# Make changes
git add .
git commit -m "Description of changes"
git push origin main

# Vercel auto-deploys
# Monitor deployment in Vercel dashboard
\`\`\`

## Scaling Considerations

As your application grows:
1. Add database indexing for performance
2. Implement caching (Redis/Vercel KV)
3. Add rate limiting for API routes
4. Consider CDN for static assets
5. Optimize images with Next.js Image component
6. Add monitoring (Sentry, LogRocket)

## Support Resources

- Next.js Docs: https://nextjs.org/docs
- Vercel Support: https://vercel.com/support
- PlanetScale Docs: https://docs.planetscale.com
- Prisma Docs: https://www.prisma.io/docs
- OpenAI Docs: https://platform.openai.com/docs

---

Congratulations on deploying your AI-powered portfolio! 🎉

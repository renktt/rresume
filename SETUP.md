# Portfolio & Resume System - Setup Guide

## Quick Start

### 1. Install Dependencies
\`\`\`powershell
npm install
\`\`\`

### 2. Setup MySQL Database

**Option A: Local MySQL**
- Install MySQL on your machine
- Create a database: \`CREATE DATABASE portfolio_db;\`

**Option B: PlanetScale (Recommended)**
- Sign up at https://planetscale.com
- Create a new database
- Get connection string from dashboard

**Option C: Railway**
- Sign up at https://railway.app
- Create MySQL service
- Get connection string

### 3. Configure Environment Variables

Copy \`.env.local.example\` to \`.env.local\`:
\`\`\`powershell
Copy-Item .env.local.example .env.local
\`\`\`

Edit \`.env.local\` with your credentials:
\`\`\`env
DATABASE_URL="mysql://username:password@localhost:3306/portfolio_db"
OPENAI_API_KEY="sk-your-openai-api-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
\`\`\`

### 4. Setup Database Schema

\`\`\`powershell
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push
\`\`\`

### 5. Seed Sample Data (Optional)

\`\`\`powershell
npx tsx prisma/seed.ts
\`\`\`

Or manually add data via Prisma Studio:
\`\`\`powershell
npm run prisma:studio
\`\`\`

### 6. Run Development Server

\`\`\`powershell
npm run dev
\`\`\`

Visit http://localhost:3000

## Getting OpenAI API Key

1. Sign up at https://platform.openai.com
2. Go to API Keys section
3. Create new secret key
4. Copy and paste into \`.env.local\`

**Note:** OpenAI API requires credits. You'll need to add payment method.

## Database Management

### View/Edit Data with Prisma Studio
\`\`\`powershell
npm run prisma:studio
\`\`\`
Opens at http://localhost:5555

### Reset Database
\`\`\`powershell
npm run prisma:push -- --force-reset
\`\`\`

### Generate Migration
\`\`\`powershell
npx prisma migrate dev --name init
\`\`\`

## Troubleshooting

### Issue: Database connection failed
**Solution:** Check DATABASE_URL format and credentials

### Issue: Prisma Client not generated
**Solution:** Run \`npm run prisma:generate\`

### Issue: Voice AI not working
**Solution:** 
- Check OPENAI_API_KEY is valid
- Ensure browser supports Web Speech API
- Grant microphone permissions

### Issue: TypeScript errors
**Solution:** 
- Run \`npm install\` to ensure all dependencies are installed
- Restart VS Code

## Building for Production

\`\`\`powershell
npm run build
npm run start
\`\`\`

## Deploying to Vercel

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables:
   - \`DATABASE_URL\`
   - \`OPENAI_API_KEY\`
   - \`NEXT_PUBLIC_APP_URL\`
4. Deploy

## Project Features Checklist

- ✅ About Me page with AI greeting
- ✅ Resume page with PDF download
- ✅ Projects showcase with filters
- ✅ LMS with progress tracking
- ✅ Contact form with submissions
- ✅ Voice AI on all pages
- ✅ Dark mode support
- ✅ Fully responsive design
- ✅ MySQL database integration
- ✅ API routes for all features

## Support

For issues or questions, please check the main README.md file.

---

Happy coding! 🚀

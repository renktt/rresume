# Quick Reference Guide

## 🚀 Common Commands

### Development
\`\`\`powershell
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
\`\`\`

### Database
\`\`\`powershell
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Seed database with sample data
npm run seed

# Create migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
\`\`\`

### Git
\`\`\`powershell
# Check status
git status

# Add all files
git add .

# Commit changes
git commit -m "Your message"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main
\`\`\`

## 📁 Important File Locations

### Configuration
- \`.env.local\` - Environment variables (DO NOT COMMIT)
- \`next.config.js\` - Next.js configuration
- \`tailwind.config.js\` - Tailwind CSS settings
- \`tsconfig.json\` - TypeScript settings
- \`prisma/schema.prisma\` - Database schema

### Styling
- \`styles/theme.ts\` - Theme colors and tokens
- \`styles/globals.css\` - Global CSS and custom classes

### Pages
- \`app/page.tsx\` - About Me (Home)
- \`app/resume/page.tsx\` - Resume page
- \`app/projects/page.tsx\` - Projects page
- \`app/lms/page.tsx\` - LMS page
- \`app/contact/page.tsx\` - Contact page

### Components
- \`components/Navigation.tsx\` - Top navigation bar
- \`components/VoiceAI.tsx\` - Voice AI component
- \`components/PageTransition.tsx\` - Page animations

### API Routes
- \`app/api/voice-ai/route.ts\` - OpenAI integration
- \`app/api/resume/route.ts\` - Resume endpoints
- \`app/api/projects/route.ts\` - Projects endpoints
- \`app/api/lms/courses/route.ts\` - Courses endpoints
- \`app/api/contact/route.ts\` - Contact form

## 🎨 Customization Quick Tips

### Change Colors
Edit \`styles/theme.ts\`:
\`\`\`typescript
export const colors = {
  background: "#F5F5F0",  // Main background
  accent: "#E6D8C3",      // Cards, highlights
  secondary: "#C2A68C",   // Buttons, hover
  highlight: "#5D866C",   // Primary actions, text
};
\`\`\`

### Update Personal Info
Edit \`app/page.tsx\` (About Me section):
\`\`\`typescript
// Update the bio text
const greeting = "Your custom greeting message...";
\`\`\`

### Change AI Personality
Edit \`app/api/voice-ai/route.ts\`:
\`\`\`typescript
const systemPrompt = \`Your custom AI personality...\`;
\`\`\`

### Add Navigation Item
Edit \`components/Navigation.tsx\`:
\`\`\`typescript
const navItems = [
  // ... existing items
  { name: 'New Page', href: '/new-page' },
];
\`\`\`

## 🔧 Troubleshooting

### Clear Node Modules
\`\`\`powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
\`\`\`

### Clear Next.js Cache
\`\`\`powershell
Remove-Item -Recurse -Force .next
npm run dev
\`\`\`

### Reset Prisma
\`\`\`powershell
Remove-Item -Recurse -Force node_modules/.prisma
npm run prisma:generate
\`\`\`

### Check Environment Variables
\`\`\`powershell
# List all environment variables
Get-ChildItem Env:

# Check specific variable
$env:DATABASE_URL
\`\`\`

## 📊 Database Quick Operations

### View All Tables
\`\`\`sql
SHOW TABLES;
\`\`\`

### Count Records
\`\`\`sql
SELECT COUNT(*) FROM resume;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM courses;
SELECT COUNT(*) FROM contact_messages;
\`\`\`

### Quick Data Cleanup
\`\`\`sql
DELETE FROM contact_messages WHERE read = true;
DELETE FROM user_progress WHERE progress = 0;
\`\`\`

## 🌐 URLs (Development)

- **Main App:** http://localhost:3000
- **Prisma Studio:** http://localhost:5555
- **API Routes:** http://localhost:3000/api/*

## 📝 Environment Variables Template

\`\`\`.env
DATABASE_URL="mysql://user:pass@host:3306/dbname"
OPENAI_API_KEY="sk-..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
\`\`\`

## 🎯 Testing Checklist

- [ ] All pages load without errors
- [ ] Voice AI works on each page
- [ ] Dark mode toggle functions
- [ ] Forms submit successfully
- [ ] PDF download works
- [ ] Navigation works on mobile
- [ ] Database operations succeed
- [ ] API routes respond correctly

## 🔐 Security Reminders

- ✅ Never commit \`.env.local\`
- ✅ Keep \`.gitignore\` updated
- ✅ Use environment variables for secrets
- ✅ Validate all user inputs
- ✅ Keep dependencies updated

## 📚 Documentation Files

- **README.md** - Complete project documentation
- **SETUP.md** - Installation guide
- **DEPLOYMENT.md** - Production deployment
- **PROJECT_OVERVIEW.md** - Project details
- **QUICK_REFERENCE.md** - This file

## 🆘 Getting Help

1. Check error messages in terminal
2. Review browser console (F12)
3. Check database connection
4. Verify environment variables
5. Review relevant documentation
6. Check GitHub issues (if public repo)

## 💡 Pro Tips

- Use Prisma Studio for easy database management
- Test voice AI in Chrome/Edge (best compatibility)
- Use dark mode to reduce eye strain
- Keep database seeded with sample data during development
- Commit frequently with descriptive messages
- Test mobile view regularly during development

---

**Quick Start:**
\`\`\`powershell
npm install
npm run prisma:push
npm run seed
npm run dev
\`\`\`

**Deploy:**
\`\`\`powershell
git add .
git commit -m "Ready for deployment"
git push origin main
# Then deploy via Vercel dashboard
\`\`\`

# Quick Setup Commands for Upstash PostgreSQL

After you've created your Upstash database and updated .env.local with your connection strings, run these commands:

## 1. Generate Prisma Client
```powershell
npm run prisma:generate
```

## 2. Push Database Schema
This creates all tables (Resume, Project, ContactMessage, AiMemory, ChatMessage)
```powershell
npx prisma db push
```

Expected output:
```
✔ Generated Prisma Client
✔ Database sync successful

Your database is now in sync with your Prisma schema.
```

## 3. (Optional) Open Prisma Studio to Add Data
```powershell
npx prisma studio
```
This opens http://localhost:5555 where you can manually add:
- Resume entries (Education, Skills, Experience)
- Projects
- Test data

## 4. Start Development Server
```powershell
npm run dev
```

Visit http://localhost:3000 and test:
- ✅ Resume section
- ✅ Projects section  
- ✅ Contact form
- ✅ AI chatbot

## Verification Checklist

- [ ] Upstash database created at console.upstash.com
- [ ] DATABASE_URL updated in .env.local (pooled connection)
- [ ] DIRECT_URL updated in .env.local (direct connection)
- [ ] Ran `npm run prisma:generate` successfully
- [ ] Ran `npx prisma db push` successfully
- [ ] Tables visible in Upstash console
- [ ] App runs without database errors
- [ ] Data loads correctly on website

## If You Encounter Errors

### Error: "Environment variable not found: DIRECT_URL"
**Fix:** Add `DIRECT_URL` to your .env.local file

### Error: "Can't reach database server"
**Fix:** 
- Check connection strings are correct
- Ensure `?sslmode=require` is at the end
- Verify database is running in Upstash console

### Error: "Column/Table does not exist"
**Fix:** Run `npx prisma db push` to sync schema

### Error: "Prisma Client not generated"
**Fix:** 
```powershell
rm -r node_modules/.prisma
npm run prisma:generate
```

## Deploying to Vercel

Add environment variables in Vercel dashboard or via CLI:

```bash
vercel env add DATABASE_URL
# Paste your pooled connection string

vercel env add DIRECT_URL
# Paste your direct connection string

vercel env add OPENAI_API_KEY
# Your OpenAI key
```

Then deploy:
```bash
git push origin main
```

Vercel will automatically build with the new PostgreSQL database!

---

**Ready?** Follow these steps and your database will be migrated to Upstash! 🚀

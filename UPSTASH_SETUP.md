# Upstash PostgreSQL Setup Guide

This guide will help you migrate your database from Railway MySQL to Upstash PostgreSQL.

## Step 1: Create Upstash Account and Database

1. **Go to Upstash Console**
   - Visit: https://console.upstash.com/
   - Sign up or log in with GitHub/Google

2. **Create PostgreSQL Database**
   - Click "PostgreSQL" in the sidebar
   - Click "Create Database"
   - Choose a name (e.g., `portfolio-db`)
   - Select a region closest to you (for best performance)
   - Click "Create"

3. **Get Connection Strings**
   After creation, you'll see your database details:
   - **Pooled Connection String** - Use for DATABASE_URL (queries)
   - **Direct Connection String** - Use for DIRECT_URL (migrations)

## Step 2: Update Environment Variables

1. **Open your `.env.local` file**

2. **Replace the DATABASE_URL values** with your Upstash connection strings:

```env
# Pooled connection (for queries)
DATABASE_URL="postgresql://username:password@host.upstash.io/database?sslmode=require"

# Direct connection (for migrations)
DIRECT_URL="postgresql://username:password@host.upstash.io/database?sslmode=require"
```

**Example:**
```env
DATABASE_URL="postgresql://default:AbCdEfGh123@relaxed-dingo-12345.us-east-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://default:AbCdEfGh123@relaxed-dingo-12345.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

## Step 3: Install Prisma and Generate Client

Run in PowerShell:

```powershell
# Generate Prisma client with new PostgreSQL schema
npm run prisma:generate
```

## Step 4: Push Database Schema

This creates all tables in your Upstash database:

```powershell
# Push schema to Upstash PostgreSQL
npx prisma db push
```

You should see output like:
```
✔ Generated Prisma Client
✔ Database sync successful
```

## Step 5: Seed Initial Data (Optional)

If you have a seed file, run it to populate initial data:

```powershell
npm run seed
```

Or manually add data through Prisma Studio:

```powershell
npm run prisma:studio
```

This opens a GUI at `http://localhost:5555` where you can:
- Add resume entries
- Add projects
- View all data

## Step 6: Verify Connection

Test your application:

```powershell
npm run dev
```

Visit `http://localhost:3000` and check:
- ✅ Resume section loads
- ✅ Projects section loads
- ✅ Contact form works
- ✅ AI chatbot stores conversations

## Step 7: Deploy to Vercel

1. **Add Environment Variables to Vercel**
   ```bash
   vercel env add DATABASE_URL
   vercel env add DIRECT_URL
   vercel env add OPENAI_API_KEY
   ```

2. **Or use Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add `DATABASE_URL` (Pooled connection)
   - Add `DIRECT_URL` (Direct connection)
   - Add `OPENAI_API_KEY`

3. **Redeploy:**
   ```bash
   git add .
   git commit -m "Migrate to Upstash PostgreSQL"
   git push origin main
   ```

## Benefits of Upstash PostgreSQL

✅ **Serverless** - No connection pooling issues
✅ **Free Tier** - 10,000 requests/day free
✅ **Fast** - Global edge network
✅ **PostgreSQL** - Full SQL support with Prisma
✅ **No Cold Starts** - Always ready
✅ **Auto-scaling** - Scales with your traffic

## Troubleshooting

### Issue: "SSL connection required"
**Solution:** Ensure your connection strings include `?sslmode=require`

### Issue: "Connection timed out"
**Solution:** Check that:
- Upstash database is running
- Connection strings are correct
- Region is accessible from your location

### Issue: "Table does not exist"
**Solution:** Run `npx prisma db push` to create tables

### Issue: Prisma Client errors
**Solution:** 
```powershell
rm -r node_modules/.prisma
npm run prisma:generate
```

## Migration from Railway

Your old Railway MySQL data is not automatically transferred. To migrate data:

### Option 1: Manual Export/Import
1. Export data from Railway using MySQL dump
2. Convert to PostgreSQL format
3. Import to Upstash

### Option 2: Fresh Start
1. Use Prisma Studio to add data manually
2. Or run seed script with your data

### Option 3: Keep Both (Recommended for testing)
Keep Railway connection while testing Upstash, then switch when confident.

## Cost Comparison

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **Upstash** | 10K requests/day | $0.20/100K requests |
| **Railway** | $5 credit | $5-$20/month |

Upstash is typically cheaper for serverless applications!

## Support

- Upstash Docs: https://docs.upstash.com/postgresql
- Prisma PostgreSQL Guide: https://www.prisma.io/docs/concepts/database-connectors/postgresql
- Discord: Join Upstash or Prisma Discord for help

---

**Need Help?** 
- Check Upstash Console logs
- Review Prisma logs: `npx prisma db push --help`
- Test connection: `npx prisma db execute --stdin < test.sql`

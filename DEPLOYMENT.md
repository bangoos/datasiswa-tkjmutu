# 🚀 Deployment Guide - Vercel + Turso SQLite

This guide will help you deploy the Student Management System to Vercel using Turso SQLite for persistent database storage.

## 📋 Prerequisites

1. GitHub repository (already done: https://github.com/bangoos/datasiswa-tkjmutu)
2. Vercel account
3. Turso account (free tier available at https://turso.tech)

## 🔧 Step 1: Setup Turso SQLite Database

### 1.1 Create Turso Account
1. Go to https://turso.tech
2. Sign up (free)
3. Install Turso CLI (optional, recommended for local management)

### 1.2 Create Database via Web Dashboard
1. Login to Turso dashboard
2. Click "New Database"
3. Name it: `datasiswa-tkjmutu`
4. Select location: Choose closest region (e.g., `ams` for Amsterdam)
5. Click "Create"

### 1.3 Get Database URL and Auth Token
1. In your Turso dashboard, click on your database
2. Copy the **Database URL** (looks like: `libsql://datasiswa-tkjmutu-[random].turso.io`)
3. Click "Generate Auth Token" or use your account token
4. Copy the **Auth Token**

### 1.4 Run Migrations
```bash
# Install Turso CLI (if not installed)
curl -sSfL https://get.tur.so/install.sh | bash

# Login to Turso
turso auth login

# Push schema to Turso
turso db shell datasiswa-tkjmutu < prisma/schema.prisma

# Or use Prisma with Turso URL
DATABASE_URL="libsql://your-db-url.turso.io?authToken=your-jwt-token" npx prisma db push
```

## 🔐 Step 2: Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output (e.g., `aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1v=`)

## 📦 Step 3: Deploy to Vercel

### 3.1 Connect Repository to Vercel
1. Go to https://vercel.com
2. Login with GitHub
3. Click "Add New" → "Project"
4. Import from: `bangoos/datasiswa-tkjmutu`

### 3.2 Configure Environment Variables

In Vercel project settings → Environment Variables, add:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | `libsql://your-db-url.turso.io?authToken=your-jwt-token` | Production, Preview, Development |
| `NEXTAUTH_SECRET` | `your-generated-secret-from-step-2` | Production, Preview, Development |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | Production |

**Important:**
- Replace `your-db-url.turso.io` with your actual Turso database URL
- Replace `your-jwt-token` with your Turso auth token
- Replace `your-project.vercel.app` with your actual Vercel domain
- For NEXTAUTH_SECRET, use the output from `openssl rand -base64 32`

### 3.3 Build Configuration

Vercel will automatically detect Next.js. Ensure these settings in `vercel.json` (optional):

```json
{
  "buildCommand": "bun run build",
  "devCommand": "bun run dev",
  "installCommand": "bun install"
}
```

### 3.4 Deploy

Click **Deploy** in Vercel dashboard. Vercel will:
1. Install dependencies with Bun
2. Build the Next.js app
3. Deploy to their global CDN

## 🗄️ Step 4: Seed Production Database

After successful deployment, you need to seed the production database with initial data.

### Option 1: Via API Endpoint
```bash
curl -X POST https://your-project.vercel.app/api/students/seed
```

### Option 2: Via Turso Shell
```bash
# Login
turso auth login

# Connect to database
turso db shell datasiswa-tkjmutu

# Run SQL insert statements
INSERT INTO Student (nama, nis, jk, ttl, nik, agama, alamat, noHp, email, noHpOrtu, namaBapak, namaIbu, pekerjaanOrtu, statusAnak, anakKe, kelas, asalSmp, tb, bb, role, password)
VALUES
  ('Administrator', 'ADMIN', 'L', '-', '-', '-', '-', '-', 'admin@tkjm.sch.id', '-', '-', '-', '-', '-', 0, 'X', '-', 0, 0, 'ADMIN', 'ADMIN');
```

## 🧪 Step 5: Test Deployment

1. Open your Vercel URL (e.g., https://datasiswa-tkjmutu.vercel.app)
2. Test Admin Login:
   - NIS: `ADMIN`
   - Password: `ADMIN`
3. Test Student Login:
   - NIS: Seed additional students or use the seed API
4. Verify all features work:
   - Dashboard statistics
   - Student table with filters
   - Import functionality
   - Student profile editing

## 🔍 Troubleshooting

### Issue: Build Fails with Database Error

**Solution:** Make sure DATABASE_URL is correct and Turso database exists.

```bash
# Test connection locally first
DATABASE_URL="libsql://your-db-url.turso.io?authToken=your-jwt-token" npx prisma db push
```

### Issue: NextAuth Redirect Loop

**Solution:** Check NEXTAUTH_URL and NEXTAUTH_SECRET environment variables.

- NEXTAUTH_URL must match your production domain (with https)
- NEXTAUTH_SECRET must be unique and properly set

### Issue: Database Connection Timeout

**Solution:** Turso might be rate-limited on free tier. Consider:
- Check Turso dashboard for quota limits
- Upgrade to paid plan if needed

### Issue: "Module not found" errors

**Solution:** Ensure all dependencies are in package.json:

```bash
# Install missing dependencies
bun install @prisma/client prisma
```

## 📊 Monitoring

### Vercel Dashboard
- Check build logs: https://vercel.com/dashboard → Your Project → Deployments
- Monitor functions: Settings → Functions
- View environment variables: Settings → Environment Variables

### Turso Dashboard
- Monitor database queries: https://turso.tech/dashboard
- Check read/write quotas
- View database locations

## 🔄 Updating the App

1. Make changes locally
2. Test locally: `bun run dev`
3. Commit and push to GitHub
4. Vercel automatically redeploys on push

## 💡 Best Practices

### Security
1. **Never commit** `.env` file to GitHub (it's in `.gitignore`)
2. Use strong NEXTAUTH_SECRET (generate new for each project)
3. Rotate Turso auth tokens periodically
4. Use environment-specific configurations

### Performance
1. Turso provides automatic read replicas for faster reads
2. Cache API responses when possible
3. Optimize database queries with Prisma
4. Use Vercel Edge Functions for global performance

### Database Management
1. Regular backups (Turso provides automatic backups)
2. Monitor database size and query patterns
3. Clean up test data in production
4. Use migrations for schema changes

## 📝 Alternative Deployment Options

If you don't want to use Turso, consider:

### Option 1: PostgreSQL (Supabase)
1. Create free Supabase account
2. Update Prisma schema: `provider = "postgresql"`
3. Set DATABASE_URL to Supabase connection string
4. Deploy normally

### Option 2: Use Traditional Hosting
Deploy to hosting that supports:
- Persistent file storage (Railway, Render, etc.)
- Node.js/Bun runtime
- Keep SQLite file storage

### Option 3: Docker Deployment
1. Create Dockerfile
2. Use volume for persistent SQLite storage
3. Deploy to any cloud provider

## 🆘 Support

If you encounter issues:

1. **Vercel Help**: https://vercel.com/support
2. **Turso Documentation**: https://docs.turso.tech
3. **Prisma Documentation**: https://www.prisma.io/docs
4. **NextAuth Documentation**: https://next-auth.js.org

## ✅ Deployment Checklist

- [ ] Turso database created
- [ ] Database URL copied
- [ ] Auth token generated
- [ ] NextAuth secret generated
- [ ] Repository connected to Vercel
- [ ] Environment variables configured in Vercel
- [ ] Build successful
- [ ] Database seeded with initial data
- [ ] Admin login tested
- [ ] Student features tested
- [ ] Domain configured (optional)

---

**Your app is now live! 🎉**

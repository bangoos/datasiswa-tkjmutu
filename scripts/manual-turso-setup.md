# 🚀 Manual Turso Setup Guide

## Step 1: Install Turso CLI

### Windows:

1. Download dari: https://github.com/tursodatabase/turso-cli/releases
2. Extract dan tambahkan ke PATH

### Atau via PowerShell:

```powershell
iwr -useb https://get.tur.so/install.ps1 | iex
```

## Step 2: Login ke Turso

```bash
turso auth login
```

## Step 3: Buat Database

```bash
turso db create datasiswa-tkjmutu --location ams
```

## Step 4: Push Schema

```bash
turso db shell datasiswa-tkjmutu < prisma/schema.prisma
```

## Step 5: Seed Data

```bash
turso db shell datasiswa-tkjmutu < scripts/seed-turso.sql
```

## Step 6: Get Database Info

```bash
# Get URL
turso db show datasiswa-tkjmutu --url

# Get Auth Token
turso db tokens create datasiswa-tkjmutu
```

## Step 7: Update Vercel Environment Variables

Di Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=libsql://your-db-url.turso.io?authToken=your-jwt-token
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://datasiswa-tkjmutu.vercel.app
```

## Step 8: Test Login

Buka: https://datasiswa-tkjmutu.vercel.app

Login dengan:

- NIS: ADMIN
- Password: ADMIN

## Troubleshooting

Jika database masih kosong setelah deploy:

1. Pastikan DATABASE_URL di Vercel benar
2. Cek Vercel Function Logs
3. Jalankan manual seed lagi:
   ```bash
   turso db shell datasiswa-tkjmutu < scripts/seed-turso.sql
   ```

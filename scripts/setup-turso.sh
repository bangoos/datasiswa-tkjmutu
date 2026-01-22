#!/bin/bash

echo "🔧 Setup Turso Database untuk Production"

# Install Turso CLI jika belum ada
if ! command -v turso &> /dev/null; then
    echo "📦 Installing Turso CLI..."
    curl -sSfL https://get.tur.so/install.sh | bash
    export PATH="$HOME/.local/bin:$PATH"
fi

# Login ke Turso
echo "🔐 Login ke Turso..."
turso auth login

# Buat database jika belum ada
echo "🗄️ Membuat database..."
turso db create datasiswa-tkjmutu --location ams 2>/dev/null || echo "Database sudah ada"

# Push schema ke Turso
echo "📋 Push schema ke Turso..."
turso db shell datasiswa-tkjmutu < prisma/schema.prisma

# Seed data ke Turso
echo "🌱 Seed data ke Turso..."
turso db shell datasiswa-tkjmutu < scripts/seed-turso.sql

# Get database URL dan token
echo "🔗 Mendapatkan database info..."
DB_URL=$(turso db show datasiswa-tkjmutu --url)
AUTH_TOKEN=$(turso db tokens create datasiswa-tkjmutu)

echo "✅ Setup selesai!"
echo ""
echo "📝 Copy environment variables berikut ke Vercel:"
echo "DATABASE_URL=\"$DB_URL?authToken=$AUTH_TOKEN\""
echo ""
echo "🌐 Database URL: $DB_URL"
echo "🔑 Auth Token: $AUTH_TOKEN"

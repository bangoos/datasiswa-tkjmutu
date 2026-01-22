# Setup Turso Database untuk Production
# Jalankan setelah install Turso CLI manual

Write-Host "🔧 Setup Turso Database untuk Production" -ForegroundColor Green

# Cek apakah Turso CLI terinstall
try {
    $tursoVersion = & turso --version
    Write-Host "✅ Turso CLI terinstall: $tursoVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Turso CLI belum terinstall!" -ForegroundColor Red
    Write-Host "📦 Install manual dari: https://github.com/tursodatabase/turso-cli/releases" -ForegroundColor Yellow
    Write-Host "Atau jalankan: iwr -useb https://get.tur.so/install.ps1 | iex" -ForegroundColor Yellow
    exit 1
}

# Login ke Turso
Write-Host "🔐 Login ke Turso..." -ForegroundColor Blue
& turso auth login

# Buat database
Write-Host "🗄️ Membuat database..." -ForegroundColor Blue
try {
    & turso db create datasiswa-tkjmutu --location ams
    Write-Host "✅ Database dibuat" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ Database mungkin sudah ada" -ForegroundColor Yellow
}

# Push schema
Write-Host "📋 Push schema ke Turso..." -ForegroundColor Blue
& turso db shell datasiswa-tkjmutu < prisma/schema.prisma

# Seed data
Write-Host "🌱 Seed data ke Turso..." -ForegroundColor Blue
& turso db shell datasiswa-tkjmutu < scripts/seed-turso.sql

# Get database info
Write-Host "🔗 Mendapatkan database info..." -ForegroundColor Blue
$dbUrl = & turso db show datasiswa-tkjmutu --url
$authToken = & turso db tokens create datasiswa-tkjmutu

Write-Host "✅ Setup selesai!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Copy environment variables berikut ke Vercel:" -ForegroundColor Yellow
Write-Host "DATABASE_URL=`"$dbUrl?authToken=$authToken`"" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Database URL: $dbUrl" -ForegroundColor Cyan
Write-Host "🔑 Auth Token: $authToken" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Sekarang update Vercel environment variables dan redeploy!" -ForegroundColor Green

@echo off
echo 🔧 Setup Turso Database untuk Production

REM Install Turso CLI jika belum ada
where turso >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Installing Turso CLI...
    curl -sSfL https://get.tur.so/install.sh | bash
    set PATH=%USERPROFILE%\.local\bin;%PATH%
)

REM Login ke Turso
echo 🔐 Login ke Turso...
turso auth login

REM Buat database jika belum ada
echo 🗄️ Membuat database...
turso db create datasiswa-tkjmutu --location ams 2>nul || echo Database sudah ada

REM Push schema ke Turso
echo 📋 Push schema ke Turso...
turso db shell datasiswa-tkjmutu < prisma/schema.prisma

REM Seed data ke Turso
echo 🌱 Seed data ke Turso...
turso db shell datasiswa-tkjmutu < scripts/seed-turso.sql

REM Get database URL dan token
echo 🔗 Mendapatkan database info...
FOR /f "delims=" %%i IN ('turso db show datasiswa-tkjmutu --url') DO set DB_URL=%%i
FOR /f "delims=" %%i IN ('turso db tokens create datasiswa-tkjmutu') DO set AUTH_TOKEN=%%i

echo ✅ Setup selesai!
echo.
echo 📝 Copy environment variables berikut ke Vercel:
echo DATABASE_URL="%DB_URL%?authToken=%AUTH_TOKEN%"
echo.
echo 🌐 Database URL: %DB_URL%
echo 🔑 Auth Token: %AUTH_TOKEN%
pause

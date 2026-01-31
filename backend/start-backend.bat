@echo off
echo ============================================
echo 🚀 VITAL DROP - REAL BACKEND STARTUP
echo ============================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
timeout /t 2 /nobreak > nul

REM Check if node_modules exists
if not exist "node_modules\" (
    echo 📦 Installing backend dependencies...
    call npm install
    echo.
)

echo 🗄️  Starting MongoDB (if not already running)...
echo If MongoDB is not installed, please install it from https://www.mongodb.com/try/download/community
echo.

echo 🌱 Seeding database with initial data...
node -e "import('./routes/seed.js').then(m => m.seedDatabase()).catch(console.error)"
echo.

echo 🚀 Starting Vital Drop Backend Server...
echo 📡 API Server: http://localhost:5000/api
echo 🔌 Socket.io: http://localhost:5000
echo.
npm run dev

@echo off
title Vital Drop - Server Launcher
color 0A

echo.
echo ========================================
echo    VITAL DROP - SERVER LAUNCHER
echo ========================================
echo.

REM Kill any existing processes on ports 5000 and 5173
echo [1/5] Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000" ^| findstr "LISTENING"') do (
    echo Stopping process on port 5000...
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Stopping process on port 5173...
    taskkill /PID %%a /F >nul 2>&1
)
echo [OK] Ports cleared
echo.

REM Check MongoDB
echo [2/5] Checking MongoDB...
net start | findstr /i "mongo" >nul
if %errorlevel% equ 0 (
    echo [OK] MongoDB is running
) else (
    echo [WARNING] MongoDB not detected
    echo Please ensure MongoDB is installed and running
)
echo.

REM Install dependencies if needed
echo [3/5] Checking dependencies...
if not exist "node_modules\vite" (
    echo Installing frontend dependencies ^(this may take a few minutes^)...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install frontend dependencies
        pause
        exit /b 1
    )
)
echo [OK] Frontend dependencies ready

if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)
echo [OK] Backend dependencies ready
echo.

REM Check .env files
echo [4/5] Checking configuration...
if not exist ".env" (
    echo Creating frontend .env...
    (
        echo VITE_API_URL=http://localhost:5000/api
        echo VITE_SOCKET_URL=http://localhost:5000
    ) > .env
)
echo [OK] Configuration ready
echo.

REM Start servers
echo [5/5] Starting servers...
echo.
echo ========================================
echo   SERVERS STARTING
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Two new windows will open:
echo   1. Backend Server (port 5000)
echo   2. Frontend Server (port 5173)
echo.
echo ========================================
echo.

timeout /t 2 >nul

REM Start backend
start "Vital Drop - BACKEND (Port 5000)" cmd /k "cd /d c:\drop-save-network\backend && echo Starting Backend Server... && npm run dev"

echo Waiting for backend to initialize...
timeout /t 5 >nul

REM Start frontend
start "Vital Drop - FRONTEND (Port 5173)" cmd /k "cd /d c:\drop-save-network && echo Starting Frontend Server... && npm run dev"

echo.
echo ========================================
echo   SERVERS STARTED!
echo ========================================
echo.
echo NEXT STEPS:
echo.
echo 1. Wait 10-15 seconds for servers to fully start
echo.
echo 2. Seed the database (IMPORTANT - First time only):
echo    Open browser: http://localhost:5000/api/seed
echo    You should see: "Database seeded successfully"
echo.
echo 3. Open the application:
echo    Open browser: http://localhost:5173
echo.
echo 4. Test login with:
echo    Hospital ID: CGH001
echo    Password: password123
echo.
echo ========================================
echo.
echo Check the two new windows for server status
echo If you see errors, read the messages carefully
echo.
echo Press any key to close this window...
pause >nul
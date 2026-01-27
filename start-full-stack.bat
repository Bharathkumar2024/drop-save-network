@echo off
echo ================================================================================
echo                    VITAL DROP - FULL STACK STARTUP
echo ================================================================================
echo.
echo This script will start both the backend and frontend servers.
echo.
echo Prerequisites:
echo   - Node.js installed
echo   - MongoDB running (local or Atlas)
echo   - Dependencies installed (npm install in both root and backend)
echo.
echo ================================================================================
echo.

REM Check if backend dependencies are installed
if not exist "backend\node_modules\" (
    echo [ERROR] Backend dependencies not installed!
    echo Please run: cd backend ^&^& npm install
    echo.
    pause
    exit /b 1
)

REM Check if frontend dependencies are installed
if not exist "node_modules\" (
    echo [ERROR] Frontend dependencies not installed!
    echo Please run: npm install
    echo.
    pause
    exit /b 1
)

echo [1/3] Starting Backend Server...
echo.
start "Vital Drop Backend" cmd /k "cd backend && npm run dev"

timeout /t 5 /nobreak >nul

echo [2/3] Starting Frontend Server...
echo.
start "Vital Drop Frontend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Opening Browser...
echo.
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo.
echo ================================================================================
echo                         SERVERS STARTED SUCCESSFULLY!
echo ================================================================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo To seed the database, visit: http://localhost:5000/api/seed
echo.
echo Press any key to close this window (servers will continue running)...
pause >nul
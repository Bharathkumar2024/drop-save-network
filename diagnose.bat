@echo off
echo ========================================
echo Vital Drop - Diagnostic Report
echo ========================================
echo.

echo [1] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    node --version
    echo [OK] Node.js is installed
) else (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
)
echo.

echo [2] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    npm --version
    echo [OK] npm is installed
) else (
    echo [ERROR] npm is not installed
)
echo.

echo [3] Checking MongoDB...
net start | findstr /i "mongo" >nul
if %errorlevel% equ 0 (
    echo [OK] MongoDB service is running
) else (
    echo [WARNING] MongoDB service not found or not running
    echo Please install MongoDB from https://www.mongodb.com/try/download/community
    echo Or start it with: net start MongoDB
)
echo.

echo [4] Checking port availability...
netstat -ano | findstr ":5000" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 5000 is in use
    netstat -ano | findstr ":5000"
) else (
    echo [OK] Port 5000 is available
)

netstat -ano | findstr ":5173" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 5173 is in use
    netstat -ano | findstr ":5173"
) else (
    echo [OK] Port 5173 is available
)
echo.

echo [5] Checking project structure...
if exist "package.json" (
    echo [OK] Frontend package.json exists
) else (
    echo [ERROR] Frontend package.json not found
)

if exist "backend\package.json" (
    echo [OK] Backend package.json exists
) else (
    echo [ERROR] Backend package.json not found
)

if exist "node_modules" (
    echo [OK] Frontend node_modules exists
) else (
    echo [WARNING] Frontend node_modules not found - run: npm install
)

if exist "backend\node_modules" (
    echo [OK] Backend node_modules exists
) else (
    echo [WARNING] Backend node_modules not found - run: cd backend && npm install
)
echo.

echo [6] Checking configuration files...
if exist ".env" (
    echo [OK] Frontend .env exists
    type .env
) else (
    echo [WARNING] Frontend .env not found
)
echo.

if exist "backend\.env" (
    echo [OK] Backend .env exists
) else (
    echo [ERROR] Backend .env not found
)
echo.

echo ========================================
echo Diagnostic Complete
echo ========================================
echo.
echo If you see any [ERROR] or [WARNING] messages above,
echo please fix them before running the application.
echo.
echo To fix and start the application, run:
echo   fix-connection.bat
echo.
pause
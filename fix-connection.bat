@echo off
echo ========================================
echo Vital Drop - Connection Fix Script
echo ========================================
echo.

echo Step 1: Checking if MongoDB is running...
echo.
net start | findstr /i "mongo" >nul
if %errorlevel% equ 0 (
    echo [OK] MongoDB service is running
) else (
    echo [WARNING] MongoDB service not found
    echo Please make sure MongoDB is installed and running
    echo.
    echo To start MongoDB:
    echo   net start MongoDB
    echo.
)

echo.
echo Step 2: Checking if ports are available...
echo.

netstat -ano | findstr ":5000" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 5000 is already in use
    echo Killing process on port 5000...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    echo [OK] Port 5000 cleared
) else (
    echo [OK] Port 5000 is available
)

netstat -ano | findstr ":5173" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 5173 is already in use
    echo Killing process on port 5173...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    echo [OK] Port 5173 cleared
) else (
    echo [OK] Port 5173 is available
)

echo.
echo Step 3: Installing dependencies...
echo.

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)

if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install backend dependencies
        pause
        exit /b 1
    )
    cd ..
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend dependencies already installed
)

echo.
echo Step 4: Checking configuration files...
echo.

if exist ".env" (
    echo [OK] Frontend .env file exists
) else (
    echo [WARNING] Frontend .env file not found
    echo Creating .env file...
    (
        echo # Backend API URL
        echo VITE_API_URL=http://localhost:5000/api
        echo.
        echo # Socket.io Server URL
        echo VITE_SOCKET_URL=http://localhost:5000
    ) > .env
    echo [OK] Frontend .env file created
)

if exist "backend\.env" (
    echo [OK] Backend .env file exists
) else (
    echo [ERROR] Backend .env file not found
    echo Please create backend\.env file
    pause
    exit /b 1
)

echo.
echo ========================================
echo All checks complete!
echo ========================================
echo.
echo Now starting the servers...
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:5173
echo.
echo Press Ctrl+C to stop the servers
echo ========================================
echo.

timeout /t 3 >nul

start "Vital Drop Backend" cmd /k "cd backend && npm run dev"
timeout /t 5 >nul
start "Vital Drop Frontend" cmd /k "npm run dev"

echo.
echo [OK] Servers started in separate windows
echo.
echo Next steps:
echo 1. Wait for both servers to start (check the new windows)
echo 2. Visit http://localhost:5000/api/seed to seed the database
echo 3. Visit http://localhost:5173 to view the application
echo.
echo If you see errors, check the server windows for details
echo.
pause
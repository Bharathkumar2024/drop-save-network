@echo off
echo ========================================
echo   Starting Vital Drop Frontend
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] Checking if port 5173 is available...
netstat -ano | findstr ":5173" >nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 5173 is already in use!
    echo Attempting to free the port...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 2 >nul
)

echo [2/2] Starting frontend server...
echo.
echo ========================================
echo   Frontend will start on:
echo   http://localhost:5173
echo ========================================
echo.

npm run dev

pause
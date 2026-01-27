@echo off
echo ================================================================================
echo                    VITAL DROP - COMPLETE SETUP
echo ================================================================================
echo.
echo This script will install all dependencies for both frontend and backend.
echo.
echo This may take a few minutes...
echo.
echo ================================================================================
echo.

echo [1/2] Installing Frontend Dependencies...
echo.
call npm install
if errorlevel 1 (
    echo.
    echo [ERROR] Frontend dependency installation failed!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo [2/2] Installing Backend Dependencies...
echo.
cd backend
call npm install
if errorlevel 1 (
    echo.
    echo [ERROR] Backend dependency installation failed!
    echo Please check your internet connection and try again.
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ================================================================================
echo                         SETUP COMPLETED SUCCESSFULLY!
echo ================================================================================
echo.
echo Next steps:
echo   1. Ensure MongoDB is running (local or Atlas)
echo   2. Configure backend/.env if needed
echo   3. Run: start-full-stack.bat to start both servers
echo   4. Visit: http://localhost:5000/api/seed to seed database
echo.
echo For more information, see:
echo   - FRONTEND_BACKEND_INTEGRATION.md
echo   - backend/SETUP.md
echo   - backend/README.md
echo.
pause
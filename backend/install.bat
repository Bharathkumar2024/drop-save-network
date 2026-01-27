@echo off
echo Installing Vital Drop Backend Dependencies...
cd /d "%~dp0"
call npm install
echo.
echo Installation complete!
echo.
echo To start the server:
echo   npm run dev    (development mode with auto-reload)
echo   npm start      (production mode)
echo.
pause
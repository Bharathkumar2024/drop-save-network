@echo off
echo ========================================
echo   Starting Frontend in MOCK MODE
echo ========================================
echo.
echo Mock Mode: Frontend will run WITHOUT backend
echo All data is simulated for preview purposes
echo.

REM Check if .env exists
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
)

REM Enable mock mode in .env
echo Enabling Mock Mode...
powershell -Command "(Get-Content .env) -replace 'VITE_MOCK_MODE=false', 'VITE_MOCK_MODE=true' | Set-Content .env"
powershell -Command "if ((Get-Content .env | Select-String 'VITE_MOCK_MODE').Count -eq 0) { Add-Content .env 'VITE_MOCK_MODE=true' }"

echo.
echo ========================================
echo   Mock Mode ENABLED
echo ========================================
echo.
echo You can now:
echo   - Login with ANY credentials
echo   - View all dashboards with mock data
echo   - Test all frontend features
echo.
echo Browser console will show:
echo   "Mock Mode Enabled - Using mock data"
echo.
echo To use REAL backend, run: START_SERVERS.bat
echo ========================================
echo.
echo Starting development server...
echo.

npm run dev

pause
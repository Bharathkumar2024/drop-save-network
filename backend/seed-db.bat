@echo off
echo Seeding Database with Mock Data...
cd /d "%~dp0"
curl -X POST http://localhost:5000/api/seed
echo.
echo Database seeded!
pause
@echo off
echo ABAC Portal - Starting...
echo.

REM Check Docker
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Docker is not installed. Please install Docker.
    pause
    exit /b 1
)

echo Stopping existing containers...
docker compose down

echo Building containers...
docker compose build

echo Starting services...
docker compose up -d

echo.
echo ABAC Portal is running!
echo.
echo Links:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5000
echo   API Docs:  http://localhost:5000/docs
echo.
echo To view logs:
echo   docker compose logs -f
echo.
echo To stop:
echo   docker compose down

pause


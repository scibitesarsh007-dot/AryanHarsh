@echo off
REM SciBites - Local Server Runner (Shareable)
REM Starts Python HTTP server and opens in browser

echo Starting SciBites local server...
echo Directory: %CD%
echo.

REM Start server in background (non-blocking)
start /b python -m http.server 8000

REM Wait a moment for server to start
timeout /t 2 /nobreak >nul

REM Open in default browser
start http://localhost:8000

echo.
echo ✓ Server started! SciBites running at:
echo   http://localhost:8000
echo.
echo To share: Send this folder OR zip it + tell them to double-click run.bat
echo Press Ctrl+C in server window to stop, then any key here to exit.
echo.
pause >nul

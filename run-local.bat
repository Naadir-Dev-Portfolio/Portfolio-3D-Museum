@echo off
REM ============================================================
REM  Double-click this file to preview the 3D museum locally.
REM  It starts a small web server (the page can't run from a
REM  plain file:// double-click) and opens your browser.
REM  Close this black window to stop the server.
REM ============================================================
cd /d "%~dp0"
echo.
echo   Naadir 3D Portfolio Museum - local preview
echo   Opening http://localhost:5173 ...
echo   (Keep this window open. Close it to stop the server.)
echo.
start "" http://localhost:5173
python -m http.server 5173

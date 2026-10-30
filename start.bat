@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js belum tersedia. Gunakan Live Server di VS Code atau lihat README.md.
  pause
  exit /b 1
)
node server.mjs
pause

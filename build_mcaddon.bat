@echo off
setlocal

where py >nul 2>nul
if %errorlevel%==0 (
  py -3 "%~dp0build_mcaddon.py"
  goto :end
)

where python >nul 2>nul
if %errorlevel%==0 (
  python "%~dp0build_mcaddon.py"
  goto :end
)

echo Fehler: Python wurde nicht gefunden. Bitte Python 3 installieren.
exit /b 1

:end
endlocal

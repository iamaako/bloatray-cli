@echo off
chcp 65001 >nul 2>&1
title BloatRay - The Dependency X-Ray

echo.
echo   +================================================================+
echo   ^|                                                                ^|
echo   ^|    ____  _             _   ____                                ^|
echo   ^|   ^| __ )^| ^| ___   __ _^| ^|_^|  _ \ __ _ _   _                  ^|
echo   ^|   ^|  _ \^| ^|/ _ \ / _` ^| __^| ^|_) / _` ^| ^| ^| ^|                 ^|
echo   ^|   ^| ^|_) ^| ^| (_) ^| (_^| ^| ^|_^|  _ ^< (_^| ^| ^|_^| ^|                 ^|
echo   ^|   ^|____/^|_^|\___/ \__,_^|\__^|_^| \_\__,_^|\__, ^|                 ^|
echo   ^|                                        ^|___/                  ^|
echo   ^|                                                                ^|
echo   +================================================================+
echo   ^|  THE DEPENDENCY X-RAY  ^|  Track E: DX-Ray Hackathon  ^|  v1.0  ^|
echo   +================================================================+
echo.

:: Step 1: Check prerequisites
echo   [ 1/6 ] Checking prerequisites...
echo   ============================================================

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo   [X] Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do echo   [OK] Node.js %%i

where git >nul 2>&1
if %errorlevel% neq 0 (
    echo   [X] Git not found. Install from https://git-scm.com
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('git --version') do echo   [OK] %%i

:: Step 2: Locate project
echo.
echo   [ 2/6 ] Locating BloatRay project...
echo   ============================================================

set "INSTALL_DIR="

:: Case 1: Already inside bloatray-cli
if exist "package.json" (
    findstr /c:"bloatray-cli" package.json >nul 2>&1
    if not errorlevel 1 (
        set "INSTALL_DIR=%cd%"
        echo   [OK] Found BloatRay in current directory
    )
)

:: Case 2: bloatray-cli subfolder
if not defined INSTALL_DIR (
    if exist "bloatray-cli\package.json" (
        set "INSTALL_DIR=%cd%\bloatray-cli"
        echo   [OK] Found BloatRay in .\bloatray-cli
    )
)

:: Case 3: Clone to Desktop
if not defined INSTALL_DIR (
    set "INSTALL_DIR=%USERPROFILE%\Desktop\bloatray-cli"

    if exist "%USERPROFILE%\Desktop\bloatray-cli\package.json" (
        echo   [OK] Found existing clone on Desktop
    ) else (
        echo   Cloning to Desktop...
        git clone https://github.com/iamaako/bloatray-cli.git "%USERPROFILE%\Desktop\bloatray-cli"
        if not exist "%USERPROFILE%\Desktop\bloatray-cli\package.json" (
            echo   [X] Clone failed. Try manually:
            echo       cd %USERPROFILE%\Desktop
            echo       git clone https://github.com/iamaako/bloatray-cli.git
            pause
            exit /b 1
        )
        echo   [OK] Cloned to %USERPROFILE%\Desktop\bloatray-cli
    )
)

cd /d "%INSTALL_DIR%"

:: Step 3: Install dependencies
echo.
echo   [ 3/6 ] Installing dependencies...
echo   ============================================================
call npm install
echo   [OK] Dependencies installed

:: Step 4: Build
echo.
echo   [ 4/6 ] Building BloatRay CLI...
echo   ============================================================
call npm run build
echo   [OK] TypeScript compiled to dist/
echo   Linking global command...
call npm link >nul 2>&1
echo   [OK] 'bloatray' command registered globally

:: Step 5: Setup test projects
echo.
echo   [ 5/6 ] Setting up test demo projects...
echo   ============================================================

for /d %%D in ("test-projects\*") do (
    if exist "%%D\package.json" (
        echo   [*] %%~nxD
        cd /d "%%D"
        call npm install --ignore-scripts >nul 2>&1
        cd /d "%INSTALL_DIR%"
    )
)
echo   [OK] All test projects ready

:: Step 6: Launch
echo.
echo   [ 6/6 ] Launching BloatRay...
echo   ============================================================
echo.
echo   +================================================================+
echo   ^|  [OK] ALL SYSTEMS READY                                       ^|
echo   +================================================================+
echo   ^|                                                                ^|
echo   ^|  Launching BloatRay interactive terminal...                    ^|
echo   ^|                                                                ^|
echo   ^|  Next time just run:  bloatray                                 ^|
echo   ^|                                                                ^|
echo   +================================================================+
echo.

timeout /t 2 >nul
node dist/index.js

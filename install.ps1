#!/usr/bin/env pwsh
# ==================================================================
#  BloatRay - The Dependency X-Ray
#  irm https://raw.githubusercontent.com/iamaako/bloatray-cli/main/install.ps1 | iex
# ==================================================================

# Do NOT use "Stop" — git writes progress to stderr which PowerShell treats as error
$ErrorActionPreference = "SilentlyContinue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

function Write-Step {
    param([int]$Num, [int]$Total, [string]$Text)
    Write-Host ""
    Write-Host "  [ " -NoNewline -ForegroundColor Cyan
    Write-Host "$Num/$Total" -NoNewline -ForegroundColor Magenta
    Write-Host " ] " -NoNewline -ForegroundColor Cyan
    Write-Host $Text -ForegroundColor White
    Write-Host "  ============================================================" -ForegroundColor DarkCyan
}

# --- Banner ---
Clear-Host
Write-Host ""
Write-Host "  +================================================================+" -ForegroundColor Cyan
Write-Host "  |                                                                |" -ForegroundColor Cyan
Write-Host "  |    ____  _             _   ____                                |" -ForegroundColor Cyan
Write-Host "  |" -NoNewline -ForegroundColor Cyan
Write-Host "   | __ )| | ___   __ _| |_|  _ \ __ _ _   _" -NoNewline -ForegroundColor Magenta
Write-Host "                  |" -ForegroundColor Cyan
Write-Host "  |" -NoNewline -ForegroundColor Cyan
Write-Host "   |  _ \| |/ _ \ / _`` | __| |_) / _`` | | | |" -NoNewline -ForegroundColor Magenta
Write-Host "                 |" -ForegroundColor Cyan
Write-Host "  |" -NoNewline -ForegroundColor Cyan
Write-Host "   | |_) | | (_) | (_| | |_|  _ < (_| | |_| |" -NoNewline -ForegroundColor Magenta
Write-Host "                 |" -ForegroundColor Cyan
Write-Host "  |" -NoNewline -ForegroundColor Cyan
Write-Host "   |____/|_|\___/ \__,_|\__|_| \_\__,_|\__, |" -NoNewline -ForegroundColor Magenta
Write-Host "                 |" -ForegroundColor Cyan
Write-Host "  |" -NoNewline -ForegroundColor Cyan
Write-Host "                                        |___/" -NoNewline -ForegroundColor Magenta
Write-Host "                  |" -ForegroundColor Cyan
Write-Host "  |                                                                |" -ForegroundColor Cyan
Write-Host "  +================================================================+" -ForegroundColor Cyan
Write-Host "  |" -NoNewline -ForegroundColor Cyan
Write-Host "  THE DEPENDENCY X-RAY" -NoNewline -ForegroundColor White
Write-Host "  |  Track E: DX-Ray Hackathon  |  v1.0" -NoNewline -ForegroundColor DarkGray
Write-Host "  |" -ForegroundColor Cyan
Write-Host "  +================================================================+" -ForegroundColor Cyan
Write-Host ""

# --- Check prerequisites ---
Write-Step 1 5 "Checking prerequisites..."

$nodeVersion = $null
try { $nodeVersion = (node -v 2>$null) } catch {}

if (-not $nodeVersion) {
    Write-Host "  [X] Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "  [OK] Node.js $nodeVersion" -ForegroundColor Green

$gitVersion = $null
try { $gitVersion = (git --version 2>$null) } catch {}

if (-not $gitVersion) {
    Write-Host "  [X] Git not found. Install from https://git-scm.com" -ForegroundColor Red
    exit 1
}
Write-Host "  [OK] $gitVersion" -ForegroundColor Green

# --- Locate project ---
Write-Step 2 5 "Locating BloatRay project..."

$installDir = $null

# Case 1: Already inside bloatray-cli
if (Test-Path "package.json") {
    try {
        $pkg = Get-Content "package.json" -Raw | ConvertFrom-Json
        if ($pkg.name -eq "bloatray-cli") {
            $installDir = (Get-Location).Path
            Write-Host "  [OK] Found BloatRay in current directory" -ForegroundColor Green
        }
    } catch {}
}

# Case 2: bloatray-cli is a subfolder of current dir
if ((-not $installDir) -and (Test-Path "bloatray-cli/package.json")) {
    $installDir = (Resolve-Path "bloatray-cli").Path
    Write-Host "  [OK] Found BloatRay in ./bloatray-cli" -ForegroundColor Green
}

# Case 3: Clone from GitHub into a safe user-writable location
if (-not $installDir) {
    # Use Desktop so it works even if PowerShell opened in System32
    $safeDir = Join-Path ([Environment]::GetFolderPath("Desktop")) "bloatray-cli"

    # If already cloned on Desktop before, reuse it
    if (Test-Path (Join-Path $safeDir "package.json")) {
        $installDir = $safeDir
        Write-Host "  [OK] Found existing clone on Desktop" -ForegroundColor Green
    } else {
        Write-Host "  Cloning to Desktop..." -ForegroundColor DarkGray
        # Use Start-Process to avoid PowerShell treating git's stderr as error
        Start-Process -FilePath "git" -ArgumentList "clone","https://github.com/iamaako/bloatray-cli.git",$safeDir -Wait -NoNewWindow
        if (Test-Path (Join-Path $safeDir "package.json")) {
            $installDir = $safeDir
            Write-Host "  [OK] Cloned to $installDir" -ForegroundColor Green
        } else {
            Write-Host "  [X] Clone failed. Try manually:" -ForegroundColor Red
            Write-Host "      cd ~\Desktop" -ForegroundColor Yellow
            Write-Host "      git clone https://github.com/iamaako/bloatray-cli.git" -ForegroundColor Yellow
            exit 1
        }
    }
}

Set-Location $installDir

# --- Install dependencies ---
Write-Step 3 5 "Installing dependencies..."
Start-Process -FilePath "npm" -ArgumentList "install" -Wait -NoNewWindow
Write-Host "  [OK] Dependencies installed" -ForegroundColor Green

# --- Build ---
Write-Step 4 5 "Building BloatRay CLI..."
Start-Process -FilePath "npm" -ArgumentList "run","build" -Wait -NoNewWindow
Write-Host "  [OK] TypeScript compiled to dist/" -ForegroundColor Green

# --- Setup test projects ---
Write-Step 5 5 "Setting up test demo projects..."

$testDir = Join-Path $installDir "test-projects"
if (Test-Path $testDir) {
    $demos = Get-ChildItem $testDir -Directory | Where-Object {
        Test-Path (Join-Path $_.FullName "package.json")
    }
    foreach ($demo in $demos) {
        Write-Host "  [*] " -NoNewline -ForegroundColor Magenta
        Write-Host $demo.Name -ForegroundColor White
        Start-Process -FilePath "npm" -ArgumentList "install","--ignore-scripts","--prefix",$demo.FullName -Wait -NoNewWindow
    }
}
Write-Host "  [OK] All test projects ready" -ForegroundColor Green

# --- Launch ---
Write-Host ""
Write-Host "  +================================================================+" -ForegroundColor Cyan
Write-Host "  |  " -NoNewline -ForegroundColor Cyan
Write-Host "[OK] ALL SYSTEMS READY" -NoNewline -ForegroundColor Green
Write-Host "                                      |" -ForegroundColor Cyan
Write-Host "  +================================================================+" -ForegroundColor Cyan
Write-Host "  |                                                                |" -ForegroundColor Cyan
Write-Host "  |  " -NoNewline -ForegroundColor Cyan
Write-Host "Launching BloatRay interactive terminal..." -NoNewline -ForegroundColor White
Write-Host "                  |" -ForegroundColor Cyan
Write-Host "  |                                                                |" -ForegroundColor Cyan
Write-Host "  |  " -NoNewline -ForegroundColor Cyan
Write-Host "Next time run: " -NoNewline -ForegroundColor DarkGray
Write-Host "node dist/index.js" -NoNewline -ForegroundColor Cyan
Write-Host "                          |" -ForegroundColor Cyan
Write-Host "  |                                                                |" -ForegroundColor Cyan
Write-Host "  +================================================================+" -ForegroundColor Cyan
Write-Host ""

Start-Sleep -Seconds 2

# Launch the interactive terminal
node dist/index.js

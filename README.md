# BloatRay — The Dependency X-Ray

> **Track E: Dependency X-Ray** — DX-Ray Hackathon Entry by **Aarif Khan**

BloatRay scans your Node.js project's dependency tree, visualizes hidden bloat in a stunning interactive CLI dashboard, and offers 1-click auto-cleanup — saving you CI/CD time and disk space.

```
  ██████╗ ██╗      ██████╗  █████╗ ████████╗██████╗  █████╗ ██╗   ██╗
  ██╔══██╗██║     ██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗╚██╗ ██╔╝
  ██████╔╝██║     ██║   ██║███████║   ██║   ██████╔╝███████║ ╚████╔╝
  ██╔══██╗██║     ██║   ██║██╔══██║   ██║   ██╔══██╗██╔══██║  ╚██╔╝
  ██████╔╝███████╗╚██████╔╝██║  ██║   ██║   ██║  ██║██║  ██║   ██║
  ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝
```

---

## The 3 Core Questions

| Question | Answer |
|---|---|
| **What DX problem am I scanning?** | Hidden dependency bloat and unused packages that slow down CI/CD and developer onboarding. |
| **What does my tool output?** | A CLI dashboard highlighting unused packages, their disk size impact, and a 1-click auto-cleanup prompt. |
| **Where does the data come from?** | Project `package.json`, local `node_modules` size calculation, and source code import analysis via `depcheck`. |

---

## The 3-Step Pipeline

1. **SCAN** — Uses `depcheck` to analyze `package.json` + source code imports. Calculates real disk size of each unused package inside `node_modules`.
2. **VISUALIZE** — Renders a beautiful interactive CLI dashboard with a Dependency Health Score (0-100%), total MB of bloat, colored impact bars, and a ranked table of unused packages.
3. **ACT** — Prompts the user to auto-remove unused packages via `npm uninstall`, cleaning the repository in one click.

---

## Install & Run — One URL, One Paste

### Method 1: `irm` One-Liner (Recommended)

Open PowerShell and paste this single line:

```powershell
irm https://raw.githubusercontent.com/iamaako/bloatray-cli/main/install.ps1 | iex
```

**That's it.** The script will:
1. Check that Node.js and Git are installed
2. Clone the repo (or detect if you're already inside it)
3. Install all dependencies
4. Build the TypeScript CLI
5. Set up all 6 test demo projects
6. **Auto-launch the interactive BloatRay terminal**

You'll immediately see a **folder picker** — select a project and start scanning.

### Method 2: Already Cloned the Repo?

```powershell
cd bloatray-cli
.\install.ps1
```

Or with Node directly:

```bash
cd bloatray-cli
node setup.js
```

### Method 3: Manual Setup

```bash
cd bloatray-cli
npm install
npm run build
node dist/index.js
```

### After Setup — Run Anytime

```bash
# Interactive mode — folder picker + action menu
node dist/index.js

# Direct scan of any project
node dist/index.js scan --dir test-projects/demo-1-heavy-bloat

# Scan + auto-fix
node dist/index.js fix --dir test-projects/demo-1-heavy-bloat

# Scan ANY project on your machine
node dist/index.js scan --dir C:\Users\you\your-project
```

---

## Scanning Other Projects

BloatRay can scan **any** Node.js project on your machine — not just itself. Use the `--dir` flag to point at any directory containing a `package.json`:

```bash
# Scan any project by path
node dist/index.js scan --dir /path/to/your/project

# Scan + auto-fix any project
node dist/index.js fix --dir /path/to/your/project

# Relative paths work too
node dist/index.js scan --dir ../my-other-project

# Interactive mode — use "Change Directory" to switch between projects
node dist/index.js
```

### Interactive Mode — The Full Experience (Default)

When you run `node dist/index.js`, BloatRay launches a **cyberpunk terminal UI** with this flow:

**Step 1: Folder Picker** — Select a project to scan:
| Option | Description |
|---|---|
| **Current Directory** | Scan the folder you're in |
| **demo-1-heavy-bloat** | Pre-built test: 8 unused deps |
| **demo-2-clean-project** | Pre-built test: zero bloat |
| **...all 6 demos** | Auto-detected from `test-projects/` |
| **Enter custom path...** | Paste or type any project path on your machine |

**Step 2: Action Menu** — Choose what to do:
| Action | Description |
|---|---|
| **Scan & Report** | Detect unused deps, show bloat dashboard |
| **Scan & Auto-Fix** | Detect + prompt to auto-remove bloat |
| **Switch Project** | Go back to folder picker |
| **Exit** | Shutdown BloatRay |

You stay in the loop — scan, fix, switch projects — until you exit.

---

## Commands Reference

| Command | Description |
|---|---|
| `node dist/index.js` | Launch interactive dashboard (default) |
| `node dist/index.js scan` | Scan current directory and display report |
| `node dist/index.js scan --dir <path>` | Scan a specific project directory |
| `node dist/index.js scan --fix` | Scan + prompt to auto-remove unused |
| `node dist/index.js fix` | Shortcut for scan + fix |
| `node dist/index.js fix --dir <path>` | Fix a specific project directory |
| `node dist/index.js -v` | Show version |

### Flags

| Flag | Description |
|---|---|
| `-d, --dir <path>` | Target project directory (defaults to current dir) |
| `--fix` | Prompt to auto-remove unused packages after scan |

---

## Test Demo Projects

6 pre-built test projects are included in `test-projects/` to demonstrate different bloat scenarios:

### Demo 1: Heavy Bloat (`demo-1-heavy-bloat`)
- **Scenario:** Express app with 10 deps, only 2 are used (`express`, `dotenv`)
- **Expected:** 8 unused packages, ~8.9 MB of bloat, Health Score ~20% (CRITICAL)
- **Run:** `npm run test:demo1`

### Demo 2: Clean Project (`demo-2-clean-project`)
- **Scenario:** Express + cors app where all deps are actually used
- **Expected:** Zero bloat, Health Score 100% (EXCELLENT)
- **Run:** `npm run test:demo2`

### Demo 3: DevDependency Bloat (`demo-3-devdep-bloat`)
- **Scenario:** Fastify app with many unused dev tools (eslint, prettier, husky, etc.)
- **Expected:** Multiple unused devDeps flagged
- **Run:** `npm run test:demo3`

### Demo 4: TypeScript Bloat (`demo-4-typescript-bloat`)
- **Scenario:** TypeScript CLI using zod + commander, but has 6+ unused packages (dayjs, nanoid, inquirer, ora, figlet, boxen)
- **Expected:** Mixed bloat — unused production + dev packages
- **Run:** `npm run test:demo4`

### Demo 5: React/Frontend Bloat (`demo-5-react-bloat`)
- **Scenario:** React app with 15 deps, only 4 used (react, react-dom, react-router-dom, clsx)
- **Expected:** Heavy bloat from framer-motion, react-icons, react-hook-form, recharts, etc.
- **Run:** `npm run test:demo5`

### Demo 6: Empty Project (`demo-6-empty-project`)
- **Scenario:** Edge case — project with zero dependencies
- **Expected:** Zero bloat, Health Score 100%, graceful handling
- **Run:** `npm run test:demo6`

### Run All Demos Quickly

```bash
npm run test:demo1
npm run test:demo2
npm run test:demo3
npm run test:demo4
npm run test:demo5
npm run test:demo6
```

---

## Hosting & Distribution

### Option 1: npm Global Install (Recommended)

Publish to npm so anyone can install and run it globally:

```bash
# Build first
npm run build

# Login to npm (one-time)
npm login

# Publish
npm publish

# Then anyone can install globally:
npm install -g bloatray-cli

# And run from anywhere:
bloatray scan --dir /path/to/project
```

### Option 2: npx (No Install Required)

Once published to npm, users can run it without installing:

```bash
npx bloatray-cli scan --dir /path/to/project
```

### Option 3: GitHub Release Binary

1. Push the repo to GitHub
2. Create a release and attach the built `dist/` folder
3. Users clone and run:

```bash
git clone https://github.com/iamaako/bloatray-cli.git
cd bloatray-cli
node setup.js          # One-command setup
node dist/index.js     # Run
```

### Option 4: Docker

Create a `Dockerfile` for containerized usage:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENTRYPOINT ["node", "dist/index.js"]
```

```bash
# Build the image
docker build -t bloatray .

# Scan a project (mount it as a volume)
docker run -it -v /path/to/project:/target bloatray scan --dir /target
```

### Option 5: CI/CD Integration

Add BloatRay to your CI pipeline to catch bloat early:

```yaml
# GitHub Actions example
- name: Check dependency bloat
  run: |
    npx bloatray-cli scan --dir . --fix false
```

---

## Tech Stack

| Library | Purpose |
|---|---|
| **Node.js + TypeScript** | Runtime & type safety |
| **Commander** | CLI framework with commands & flags |
| **@clack/prompts** | Beautiful interactive terminal UI |
| **picocolors** | Terminal styling (colors, bold, dim, etc.) |
| **depcheck** | Programmatic unused dependency detection |
| **fs/promises + path** | File system & directory size calculation |
| **child_process** | Execute `npm uninstall` for auto-cleanup |

---

## Project Structure

```
bloatray-cli/
├── package.json          # Dependencies, bin, scripts
├── tsconfig.json         # TypeScript configuration
├── setup.js              # One-command setup script
├── README.md             # This file
├── src/
│   ├── index.ts          # Commander CLI setup + main flow
│   ├── scanner.ts        # depcheck + node_modules size calc
│   ├── fixer.ts          # npm uninstall execution logic
│   └── ui.ts             # @clack/prompts UI + ASCII art
├── dist/                 # Compiled JS output (after build)
└── test-projects/
    ├── demo-1-heavy-bloat/       # 8 unused deps, CRITICAL
    ├── demo-2-clean-project/     # Zero bloat, EXCELLENT
    ├── demo-3-devdep-bloat/      # Unused devDependencies
    ├── demo-4-typescript-bloat/  # TypeScript mixed bloat
    ├── demo-5-react-bloat/       # Frontend/React bloat
    └── demo-6-empty-project/     # Edge case: no deps
```

---

## How It Works

1. **Scanner** reads `package.json` and uses `depcheck` to analyze all `.ts`, `.tsx`, `.js`, `.jsx` files for `import`/`require` statements
2. Compares declared dependencies against actual usage to find unused packages
3. Recursively calculates the real disk size of each unused package folder inside `node_modules/`
4. **Visualizer** renders an ASCII art banner, health score gradient bar, color-coded impact bars, ranked bloat table, and summary stats
5. **Fixer** offers an interactive confirm prompt and runs `npm uninstall` to clean up automatically

---

## License

MIT — Built with ♥ by **Aarif Khan** for the DX-Ray Hackathon.

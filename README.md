<div align="center">

```
  ██████╗ ██╗      ██████╗  █████╗ ████████╗██████╗  █████╗ ██╗   ██╗
  ██╔══██╗██║     ██╔═══██╗██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗╚██╗ ██╔╝
  ██████╔╝██║     ██║   ██║███████║   ██║   ██████╔╝███████║ ╚████╔╝
  ██╔══██╗██║     ██║   ██║██╔══██║   ██║   ██╔══██╗██╔══██║  ╚██╔╝
  ██████╔╝███████╗╚██████╔╝██║  ██║   ██║   ██║  ██║██║  ██║   ██║
  ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝
```

### The Dependency X-Ray

**Scan. Visualize. Auto-Clean.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Track](https://img.shields.io/badge/DX--Ray_Hackathon-Track_E-ff00ff)](https://github.com/iamaako/bloatray-cli)

</div>

---

<p align="center">
  <img src="screenshots/hero.png" alt="BloatRay Hero" width="48%" />
  <img src="screenshots/install.png" alt="BloatRay Install" width="48%" />
</p>
<p align="center">
  <img src="screenshots/demos.png" alt="BloatRay Demos" width="97%" />
</p>

---

## 🔍 What Is BloatRay?

BloatRay is a CLI tool that scans your Node.js project, finds **unused dependencies** hiding in your `node_modules`, shows you exactly how much disk space they waste, and lets you **auto-remove** them in one click.

> Built by **Aarif Khan** for the **DX-Ray Hackathon** — Track E: Dependency X-Ray

---

## 🧠 The 3 Core Questions

| # | Question | Answer |
|---|---|---|
| 🔎 | **What DX problem am I scanning?** | Hidden dependency bloat — unused packages that slow CI/CD, waste disk, and confuse developers. |
| 📊 | **What does my tool output?** | A CLI dashboard with health score, bloat size, impact bars, ranked table, and 1-click cleanup. |
| 📦 | **Where does the data come from?** | `package.json` + source code import analysis via `depcheck` + real `node_modules` size calculation. |

---

## ⚡ How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        BloatRay Pipeline                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   📦 package.json         🔎 SCAN                               │
│       +                  ──────────►  Find unused packages      │
│   📁 source files                     Calculate real disk size  │
│                                                                 │
│                           📊 VISUALIZE                          │
│                          ──────────►  Health Score (0-100%)     │
│                                       Impact bars + table       │
│                                       Total MB of bloat         │
│                                                                 │
│                           🧹 ACT                                │
│                          ──────────►  npm uninstall (auto)      │
│                                       1-click cleanup           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Step | What Happens |
|---|---|
| 🔎 **SCAN** | Reads `package.json`, analyzes all imports with `depcheck`, calculates real `node_modules` size per package |
| 📊 **VISUALIZE** | Renders health score bar, color-coded impact bars, ranked bloat table, total waste in MB |
| 🧹 **ACT** | Prompts to auto-remove unused packages via `npm uninstall` — clean your project in one click |

---

## 🚀 Quick Install

### Recommended — One-Liner

```powershell
irm https://raw.githubusercontent.com/iamaako/bloatray-cli/main/install.ps1 | iex
```

This single command will clone, install, build, setup demos, and auto-launch the interactive terminal.

### Manual Setup

```bash
git clone https://github.com/iamaako/bloatray-cli.git
cd bloatray-cli
npm install
npm run build
npm link        # registers 'bloatray' as a global command
bloatray        # run from anywhere
```

---

## 🎮 Usage

```bash
bloatray                                    # Interactive mode (folder picker + action menu)
bloatray scan --dir ./my-project            # Scan a specific project
bloatray fix --dir ./my-project             # Scan + auto-fix
```

---

## 🧪 6 Demo Projects Included

Pre-built test scenarios inside `test-projects/`:

| Demo | Scenario | Health Score |
|---|---|---|
| `demo-1-heavy-bloat` | Express app, 8 unused deps, ~8.9 MB wasted | 🔴 ~20% |
| `demo-2-clean-project` | All deps used, zero bloat | 🟢 100% |
| `demo-3-devdep-bloat` | Unused devDependencies (eslint, prettier, etc.) | 🔴 ~14% |
| `demo-4-typescript-bloat` | TypeScript project with mixed unused deps | 🟡 ~40% |
| `demo-5-react-bloat` | React app, 15 deps, only 4 used | 🔴 ~6% |
| `demo-6-empty-project` | Zero dependencies (edge case) | 🟢 100% |

```bash
npm run test:demo1    # Run any demo
npm run test:demo2
# ...etc
```

---

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat-square) | Runtime |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square) | Type safety |
| ![Commander](https://img.shields.io/badge/-Commander.js-red?style=flat-square) | CLI framework |
| ![depcheck](https://img.shields.io/badge/-depcheck-orange?style=flat-square) | Unused dep detection |
| ![@clack/prompts](https://img.shields.io/badge/-@clack/prompts-blueviolet?style=flat-square) | Interactive terminal UI |
| ![picocolors](https://img.shields.io/badge/-picocolors-green?style=flat-square) | Terminal colors |
| ![Next.js](https://img.shields.io/badge/-Next.js_16-black?logo=next.js&logoColor=white&style=flat-square) | Showcase website |
| ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square) | Website styling |

---

## 📁 Project Structure

```
bloatray-cli/
├── src/
│   ├── index.ts          # CLI entry point + Commander setup
│   ├── scanner.ts        # depcheck + node_modules size calc
│   ├── fixer.ts          # npm uninstall auto-cleanup
│   └── ui.ts             # Terminal UI + health score bars
├── test-projects/        # 6 demo projects
├── website/              # Showcase site (Next.js + Tailwind)
├── screenshots/          # README images
├── install.ps1           # PowerShell one-liner installer
├── install.cmd           # CMD installer
├── setup.js              # Node.js setup script
├── package.json
└── tsconfig.json
```

---

<div align="center">

**MIT** — Built with ❤️ by **Aarif Khan** for the DX-Ray Hackathon

[⬆ Back to Top](#)

</div>

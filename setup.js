#!/usr/bin/env node

/**
 * BloatRay — One-Command Setup & Launch
 *
 * Paste this in PowerShell:
 *   git clone <repo> && cd bloatray-cli && node setup.js
 *
 * Or just:
 *   node setup.js
 *
 * It installs deps, builds, sets up test projects, and auto-launches BloatRay.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = __dirname;
const TEST_DIR = path.join(ROOT, 'test-projects');

// ─── Cyberpunk colors via ANSI ───────────────────────────────────

const c = {
  cyan:    (s) => `\x1b[36m${s}\x1b[0m`,
  magenta: (s) => `\x1b[35m${s}\x1b[0m`,
  green:   (s) => `\x1b[32m${s}\x1b[0m`,
  red:     (s) => `\x1b[31m${s}\x1b[0m`,
  yellow:  (s) => `\x1b[33m${s}\x1b[0m`,
  dim:     (s) => `\x1b[2m${s}\x1b[0m`,
  bold:    (s) => `\x1b[1m${s}\x1b[0m`,
  bCyan:   (s) => `\x1b[1m\x1b[36m${s}\x1b[0m`,
  bMag:    (s) => `\x1b[1m\x1b[35m${s}\x1b[0m`,
  bGreen:  (s) => `\x1b[1m\x1b[32m${s}\x1b[0m`,
};

function run(cmd, cwd) {
  console.log(`  ${c.dim('$')} ${c.cyan(cmd)}`);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

function step(num, total, text) {
  console.log('');
  console.log(`  ${c.bCyan('[')} ${c.bMag(`${num}/${total}`)} ${c.bCyan(']')} ${c.bold(text)}`);
  console.log(`  ${c.dim('─'.repeat(60))}`);
}

async function main() {
  console.clear();
  console.log('');
  console.log(`  ${c.cyan('╔══════════════════════════════════════════════════════════════╗')}`);
  console.log(`  ${c.cyan('║')}  ${c.bMag('██████╗ ██╗      ██████╗  █████╗ ████████╗')}${c.bCyan('██████╗  █████╗ ██╗   ██╗')} ${c.cyan('║')}`);
  console.log(`  ${c.cyan('║')}  ${c.bMag('██╔══██╗██║     ██╔═══██╗██╔══██╗╚══██╔══╝')}${c.bCyan('██╔══██╗██╔══██╗╚██╗ ██╔╝')} ${c.cyan('║')}`);
  console.log(`  ${c.cyan('║')}  ${c.bMag('██████╔╝██║     ██║   ██║███████║   ██║   ')}${c.bCyan('██████╔╝███████║ ╚████╔╝ ')} ${c.cyan('║')}`);
  console.log(`  ${c.cyan('║')}  ${c.bMag('██╔══██╗██║     ██║   ██║██╔══██║   ██║   ')}${c.bCyan('██╔══██╗██╔══██║  ╚██╔╝  ')} ${c.cyan('║')}`);
  console.log(`  ${c.cyan('║')}  ${c.bMag('██████╔╝███████╗╚██████╔╝██║  ██║   ██║   ')}${c.bCyan('██║  ██║██║  ██║   ██║   ')} ${c.cyan('║')}`);
  console.log(`  ${c.cyan('║')}  ${c.bMag('╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ')}${c.bCyan('╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ')} ${c.cyan('║')}`);
  console.log(`  ${c.cyan('╠══════════════════════════════════════════════════════════════╣')}`);
  console.log(`  ${c.cyan('║')}  ${c.bMag('>>>')} ${c.bold('ONE-COMMAND SETUP & LAUNCH')}                               ${c.cyan('║')}`);
  console.log(`  ${c.cyan('╚══════════════════════════════════════════════════════════════╝')}`);
  console.log('');

  const totalSteps = 4;

  // Step 1: Install BloatRay deps
  step(1, totalSteps, 'Installing BloatRay CLI dependencies...');
  run('npm install', ROOT);

  // Step 2: Build TypeScript
  step(2, totalSteps, 'Compiling TypeScript to dist/...');
  run('npm run build', ROOT);

  // Step 3: Install test project deps
  step(3, totalSteps, 'Setting up test demo projects...');

  if (fs.existsSync(TEST_DIR)) {
    const demos = fs.readdirSync(TEST_DIR).filter(d => {
      const full = path.join(TEST_DIR, d);
      return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'package.json'));
    }).sort();

    for (const demo of demos) {
      const demoPath = path.join(TEST_DIR, demo);
      console.log(`\n  ${c.bMag('◈')} ${c.bold(demo)}`);
      try {
        run('npm install --ignore-scripts', demoPath);
      } catch (err) {
        console.log(`  ${c.yellow('⚠ Some packages failed (expected for demos)')}`);
      }
    }
  }

  // Step 4: Ready!
  step(4, totalSteps, 'Setup complete!');

  console.log('');
  console.log(`  ${c.cyan('╔══════════════════════════════════════════════════════════════╗')}`);
  console.log(`  ${c.cyan('║')}  ${c.bGreen('✓ ALL SYSTEMS READY')}                                        ${c.cyan('║')}`);
  console.log(`  ${c.cyan('╠══════════════════════════════════════════════════════════════╣')}`);
  console.log(`  ${c.cyan('║')}                                                              ${c.cyan('║')}`);
  console.log(`  ${c.cyan('║')}  ${c.bold('Launching BloatRay in 2 seconds...')}                          ${c.cyan('║')}`);
  console.log(`  ${c.cyan('║')}                                                              ${c.cyan('║')}`);
  console.log(`  ${c.cyan('║')}  ${c.dim('Or run manually anytime:')}                                    ${c.cyan('║')}`);
  console.log(`  ${c.cyan('║')}    ${c.bCyan('node dist/index.js')}                                        ${c.cyan('║')}`);
  console.log(`  ${c.cyan('║')}                                                              ${c.cyan('║')}`);
  console.log(`  ${c.cyan('╚══════════════════════════════════════════════════════════════╝')}`);
  console.log('');

  // Auto-launch after 2s
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Launch BloatRay interactive mode
  execSync('node dist/index.js', { cwd: ROOT, stdio: 'inherit' });
}

main().catch(err => {
  console.error(`\n  ${c.red('Setup failed:')} ${err.message}`);
  process.exit(1);
});

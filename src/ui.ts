import * as p from '@clack/prompts';
import pc from 'picocolors';
import * as path from 'path';
import * as fs from 'fs';
import { ScanResult, UnusedPackage } from './scanner';

// ─── Cyberpunk Color Helpers ─────────────────────────────────────

const neon = {
  pink: (s: string) => pc.magenta(s),
  cyan: (s: string) => pc.cyan(s),
  yellow: (s: string) => pc.yellow(s),
  red: (s: string) => pc.red(s),
  green: (s: string) => pc.green(s),
  dim: (s: string) => pc.dim(s),
  glow: (s: string) => pc.bold(pc.cyan(s)),
  hot: (s: string) => pc.bold(pc.magenta(s)),
  fire: (s: string) => pc.bold(pc.red(s)),
  acid: (s: string) => pc.bold(pc.green(s)),
  warn: (s: string) => pc.bold(pc.yellow(s)),
  muted: (s: string) => pc.dim(pc.white(s)),
};

// ─── Cyberpunk ASCII Banner ──────────────────────────────────────

const CYBER_LOGO = `
  ${neon.cyan('╔══════════════════════════════════════════════════════════════════╗')}
  ${neon.cyan('║')}  ${neon.hot('██████╗ ██╗      ██████╗  █████╗ ████████╗')}${neon.glow('██████╗  █████╗ ██╗   ██╗')}  ${neon.cyan('║')}
  ${neon.cyan('║')}  ${neon.hot('██╔══██╗██║     ██╔═══██╗██╔══██╗╚══██╔══╝')}${neon.glow('██╔══██╗██╔══██╗╚██╗ ██╔╝')}  ${neon.cyan('║')}
  ${neon.cyan('║')}  ${neon.hot('██████╔╝██║     ██║   ██║███████║   ██║   ')}${neon.glow('██████╔╝███████║ ╚████╔╝ ')}  ${neon.cyan('║')}
  ${neon.cyan('║')}  ${neon.hot('██╔══██╗██║     ██║   ██║██╔══██║   ██║   ')}${neon.glow('██╔══██╗██╔══██║  ╚██╔╝  ')}  ${neon.cyan('║')}
  ${neon.cyan('║')}  ${neon.hot('██████╔╝███████╗╚██████╔╝██║  ██║   ██║   ')}${neon.glow('██║  ██║██║  ██║   ██║   ')}  ${neon.cyan('║')}
  ${neon.cyan('║')}  ${neon.hot('╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ')}${neon.glow('╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ')}  ${neon.cyan('║')}
  ${neon.cyan('╠══════════════════════════════════════════════════════════════════╣')}
  ${neon.cyan('║')}  ${neon.hot('>>>')} ${pc.bold(pc.white('THE DEPENDENCY X-RAY'))}  ${neon.dim('|')}  ${neon.dim('Track E: DX-Ray Hackathon')}  ${neon.dim('|')}  ${neon.glow('v1.0')} ${neon.cyan('║')}
  ${neon.cyan('╚══════════════════════════════════════════════════════════════════╝')}
`;

// ─── Badge System ────────────────────────────────────────────────

const BADGE = {
  SCAN:    pc.bgCyan(pc.black(pc.bold(' ⚡ SCAN '))),
  VIZ:     pc.bgMagenta(pc.white(pc.bold(' ◈ VISUALIZE '))),
  ACT:     pc.bgGreen(pc.black(pc.bold(' ▶ ACT '))),
  CLEAN:   pc.bgGreen(pc.black(pc.bold(' ✓ CLEAN '))),
  BLOAT:   pc.bgRed(pc.white(pc.bold(' ✕ BLOAT '))),
  WARN:    pc.bgYellow(pc.black(pc.bold(' ! WARNING '))),
  SYS:     pc.bgCyan(pc.black(pc.bold(' ◆ SYSTEM '))),
  DIR:     pc.bgMagenta(pc.white(pc.bold(' ◇ TARGET '))),
};

// ─── Box Drawing ─────────────────────────────────────────────────

function cyberBox(lines: string[], title?: string): void {
  const W = 66;
  const border = neon.cyan;
  const topLeft = '╭';
  const topRight = '╮';
  const botLeft = '╰';
  const botRight = '╯';
  const horiz = '─';
  const vert = '│';

  if (title) {
    console.log(`  ${border(topLeft + horiz + '[')} ${neon.hot(title)} ${border(']' + horiz.repeat(Math.max(W - title.length - 6, 1)) + topRight)}`);
  } else {
    console.log(`  ${border(topLeft + horiz.repeat(W) + topRight)}`);
  }

  for (const line of lines) {
    console.log(`  ${border(vert)} ${line}${' '.repeat(Math.max(0, W - 2))}${border(vert)}`);
  }

  console.log(`  ${border(botLeft + horiz.repeat(W) + botRight)}`);
}

function cyberLine(): void {
  console.log(`  ${neon.cyan('├' + '─'.repeat(66) + '┤')}`);
}

function cyberSeparator(): void {
  console.log(`\n  ${neon.dim('░'.repeat(66))}\n`);
}

// ─── Progress Bar ────────────────────────────────────────────────

function neonBar(value: number, max: number, width: number = 30): string {
  const ratio = Math.min(max === 0 ? 0 : value / max, 1);
  const filled = Math.round(ratio * width);
  const empty = width - filled;

  let colorFn: (s: string) => string;
  if (ratio <= 0.1) colorFn = neon.acid;
  else if (ratio <= 0.3) colorFn = neon.warn;
  else if (ratio <= 0.6) colorFn = neon.hot;
  else colorFn = neon.fire;

  return colorFn('█'.repeat(filled)) + neon.dim('░'.repeat(empty));
}

// ─── Health Score Bar ────────────────────────────────────────────

function renderHealthBar(score: number): string {
  const totalBlocks = 25;
  const clampedScore = Math.max(0, Math.min(100, score));
  const filledBlocks = Math.round((clampedScore / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;

  let color: (text: string) => string;
  let label: string;
  let icon: string;

  if (score >= 90) {
    color = neon.acid;
    label = 'OPTIMAL';
    icon = '◉';
  } else if (score >= 70) {
    color = neon.warn;
    label = 'ACCEPTABLE';
    icon = '◎';
  } else if (score >= 50) {
    color = neon.hot;
    label = 'DEGRADED';
    icon = '◈';
  } else {
    color = neon.fire;
    label = 'CRITICAL';
    icon = '◇';
  }

  const filled = color('█'.repeat(filledBlocks));
  const empty = neon.dim('░'.repeat(emptyBlocks));

  return `  ${color(icon)} ${filled}${empty} ${color(pc.bold(`${score}%`))} ${neon.dim('// ' + label)}`;
}

// ─── Package Row ─────────────────────────────────────────────────

function renderPackageRow(dep: UnusedPackage, index: number, longest: number, maxBytes: number): string {
  const rank = neon.dim(`  ${String(index + 1).padStart(2, ' ')}.`);

  const nameColor = dep.sizeBytes >= 1024 * 1024 ? neon.fire : neon.warn;
  const nameStr = nameColor(dep.name.padEnd(longest + 1));

  const sizeBar = neonBar(dep.sizeBytes, maxBytes, 8);

  const sizeStr = dep.sizeMB === '0.00'
    ? neon.dim('< 0.01 MB')
    : dep.sizeBytes >= 1024 * 1024
      ? neon.fire(`${dep.sizeMB} MB`)
      : neon.warn(`${dep.sizeMB} MB`);

  const typeTag = dep.type === 'devDependency'
    ? pc.bgBlue(pc.white(pc.bold(' DEV ')))
    : pc.bgMagenta(pc.white(pc.bold(' PKG ')));

  return `${rank} ${typeTag} ${nameStr} ${sizeBar} ${sizeStr}`;
}

// ═══════════════════════════════════════════════════════════════════
// PUBLIC UI FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Show the cyberpunk boot sequence.
 */
export function showBoot(): void {
  console.clear();
  console.log(CYBER_LOGO);

  p.intro(pc.bgMagenta(pc.white(pc.bold(' BLOATRAY TERMINAL v1.0 '))));

  console.log('');
  console.log(`  ${neon.glow('?')}  ${pc.bold('What DX problem are we scanning?')}`);
  console.log(`     ${neon.dim('Hidden dependency bloat and unused packages')}`);
  console.log(`     ${neon.dim('that slow down CI/CD and developer onboarding.')}`);
  console.log('');
  console.log(`  ${neon.glow('>')}  ${pc.bold('What does BloatRay output?')}`);
  console.log(`     ${neon.dim('A CLI dashboard with unused packages, disk size')}`);
  console.log(`     ${neon.dim('impact, and a 1-click auto-cleanup prompt.')}`);
  console.log('');
  console.log(`  ${neon.glow('i')}  ${pc.bold('Where does the data come from?')}`);
  console.log(`     ${neon.dim('Project')} ${pc.underline('package.json')}${neon.dim(', local')} ${pc.underline('node_modules')} ${neon.dim('sizes,')}`);
  console.log(`     ${neon.dim('and source code import analysis via')} ${pc.underline('depcheck')}${neon.dim('.')}`);
  console.log('');
  console.log(`  ${neon.cyan('─'.repeat(66))}`);
  console.log('');
}

/**
 * Prompt user to select a project folder. Lists test-projects if available.
 */
export async function promptFolderSelect(cwd: string): Promise<string | symbol> {
  const testProjectsDir = path.join(cwd, 'test-projects');
  const options: { value: string; label: string; hint?: string }[] = [];

  // Add "Current Directory" option
  options.push({
    value: cwd,
    label: `${neon.glow('◆')} ${pc.bold('Current Directory')}`,
    hint: neon.dim(path.basename(cwd)),
  });

  // Auto-detect test-projects if we're inside the bloatray-cli folder
  if (fs.existsSync(testProjectsDir)) {
    try {
      const demos = fs.readdirSync(testProjectsDir).filter(d => {
        const full = path.join(testProjectsDir, d);
        return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'package.json'));
      }).sort();

      if (demos.length > 0) {
        for (const demo of demos) {
          const demoPath = path.join(testProjectsDir, demo);
          const pkgPath = path.join(demoPath, 'package.json');
          let desc = '';
          try {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
            desc = pkg.description || '';
          } catch { /* ignore */ }

          options.push({
            value: demoPath,
            label: `${neon.hot('◈')} ${pc.bold(demo)}`,
            hint: neon.dim(desc || demoPath),
          });
        }
      }
    } catch { /* ignore */ }
  }

  // "Enter custom path" option
  options.push({
    value: '__custom__',
    label: `${neon.warn('◇')} ${pc.bold('Enter custom path...')}`,
    hint: neon.dim('Type or paste any project path'),
  });

  console.log('');
  const selected = await p.select({
    message: `${neon.glow('Select a project to scan')}`,
    options,
  });

  if (p.isCancel(selected)) return selected;

  // If custom path, prompt for it
  if (selected === '__custom__') {
    const customPath = await p.text({
      message: `${neon.glow('Paste or type the project folder path')}`,
      placeholder: 'C:\\Users\\you\\your-project',
      validate(value) {
        if (!value || value.trim() === '') return 'Path cannot be empty';
        const resolved = path.resolve(value);
        if (!fs.existsSync(resolved)) return `Directory not found: ${resolved}`;
        if (!fs.existsSync(path.join(resolved, 'package.json'))) return `No package.json in: ${resolved}`;
        return undefined;
      },
    });
    return customPath;
  }

  return selected;
}

/**
 * Show the selected target directory.
 */
export function showTargetDir(targetDir: string): void {
  const dirName = path.basename(targetDir);
  console.log('');
  console.log(`  ${BADGE.DIR} ${neon.glow(dirName)}`);
  console.log(`  ${neon.dim('  ' + targetDir)}`);
  console.log('');
}

/**
 * Main action menu — cyberpunk button style.
 */
export async function showActionMenu(targetDir: string): Promise<string | symbol> {
  const dirName = path.basename(targetDir);

  const action = await p.select({
    message: `${neon.hot('[')} ${pc.bold(dirName)} ${neon.hot(']')} ${neon.glow('What do you want to do?')}`,
    options: [
      {
        value: 'scan',
        label: `${neon.glow('⚡')} ${pc.bold('Scan & Report')}`,
        hint: neon.dim('Detect unused deps, show bloat dashboard'),
      },
      {
        value: 'scan-fix',
        label: `${neon.warn('🔧')} ${pc.bold('Scan & Auto-Fix')}`,
        hint: neon.dim('Detect + prompt to auto-remove bloat'),
      },
      {
        value: 'change-dir',
        label: `${neon.hot('📂')} ${pc.bold('Switch Project')}`,
        hint: neon.dim('Pick a different folder to scan'),
      },
      {
        value: 'exit',
        label: `${neon.dim('✕')}  ${pc.bold('Exit')}`,
        hint: neon.dim('Shutdown BloatRay'),
      },
    ],
  });

  return action;
}

/**
 * Create the scan spinner.
 */
export function createScanSpinner(): ReturnType<typeof p.spinner> {
  const s = p.spinner();
  s.start(neon.cyan('Scanning dependency tree & analyzing source imports...'));
  return s;
}

/**
 * Stop scan spinner.
 */
export function stopScanSpinner(s: ReturnType<typeof p.spinner>, durationMs: number): void {
  const seconds = (durationMs / 1000).toFixed(1);
  s.stop(`${neon.acid('Scan complete')} ${neon.dim('in')} ${pc.bold(seconds + 's')}`);
}

/**
 * Display the scan results — cyberpunk dashboard.
 */
export function showResults(result: ScanResult): void {
  console.log('');

  if (result.unusedCount === 0) {
    console.log(`  ${BADGE.CLEAN}`);
    console.log('');
    console.log(`  ${neon.acid('Zero bloat detected!')}`);
    console.log(`  ${neon.dim('All')} ${neon.acid(String(result.totalDepsCount))} ${neon.dim('dependencies are actively used.')}`);
    console.log('');
    console.log(`  ${pc.bold('Health Score')}`);
    console.log(renderHealthBar(result.healthScore));
    console.log('');
    console.log(`  ${neon.dim('Your project is clean. No wasted disk space.')}`);
    console.log(`  ${neon.dim('CI/CD is running at full speed.')}`);
    console.log('');
    console.log(`  ${neon.cyan('─'.repeat(66))}`);
    return;
  }

  // ── Bloat detected ──
  const maxBytes = Math.max(...result.unusedDeps.map(d => d.sizeBytes), 1);
  const longest = Math.max(...result.unusedDeps.map(d => d.name.length), 8);
  const depCount = result.unusedDeps.filter(d => d.type === 'dependency').length;
  const devCount = result.unusedDeps.filter(d => d.type === 'devDependency').length;

  console.log(`  ${BADGE.BLOAT} ${neon.fire(`${result.unusedCount} unused package${result.unusedCount > 1 ? 's' : ''} detected`)}`);
  console.log('');
  console.log(`  ${pc.bold('Health Score')}`);
  console.log(renderHealthBar(result.healthScore));
  console.log('');
  console.log(`  ${neon.cyan('─'.repeat(66))}`);
  console.log('');
  console.log(`  ${pc.bold('Summary')}`);
  console.log(`  ${neon.dim('├─')} ${pc.bold('Total deps:')}    ${neon.glow(String(result.totalDepsCount))}`);
  console.log(`  ${neon.dim('├─')} ${pc.bold('Unused:')}        ${neon.fire(String(depCount))} ${neon.dim('prod')} + ${neon.warn(String(devCount))} ${neon.dim('dev')}`);
  console.log(`  ${neon.dim('└─')} ${pc.bold('Bloat size:')}    ${neon.fire(result.totalBloatMB + ' MB')}`);
  console.log('');
  console.log(`  ${neon.cyan('─'.repeat(66))}`);
  console.log('');
  console.log(`  ${BADGE.VIZ} ${pc.bold('Bloat Ranking')} ${neon.dim('// sorted by disk impact')}`);
  console.log('');
  console.log(`  ${neon.dim('    #  Type Package' + ' '.repeat(Math.max(longest - 4, 4)) + 'Impact    Size')}`);
  console.log(`  ${neon.dim('    ' + '─'.repeat(longest + 40))}`);

  for (let i = 0; i < result.unusedDeps.length; i++) {
    console.log(renderPackageRow(result.unusedDeps[i], i, longest, maxBytes));
  }

  console.log(`  ${neon.dim('    ' + '─'.repeat(longest + 40))}`);
  console.log(`    ${pc.bold('Total:')} ${neon.fire(result.totalBloatMB + ' MB')} ${neon.dim('//')} ${pc.bold(String(result.unusedCount))} ${neon.dim('packages')}`);
  console.log('');
  console.log(`  ${neon.cyan('─'.repeat(66))}`);
}

/**
 * Prompt for auto-cleanup.
 */
export async function promptCleanup(unusedCount: number, totalMB: string): Promise<boolean> {
  console.log('');
  console.log(`  ${BADGE.ACT} ${pc.bold('Auto-Cleanup Module')}`);
  console.log('');

  const shouldClean = await p.confirm({
    message: `Remove ${neon.fire(String(unusedCount))} unused packages and free ${neon.fire(totalMB + ' MB')}?`,
    initialValue: false,
  });

  if (p.isCancel(shouldClean)) {
    p.cancel(neon.dim('Operation cancelled.'));
    process.exit(0);
  }

  return shouldClean as boolean;
}

/**
 * Create uninstall spinner.
 */
export function createUninstallSpinner(): ReturnType<typeof p.spinner> {
  const s = p.spinner();
  s.start(neon.hot('Executing npm uninstall — purging bloat...'));
  return s;
}

/**
 * Stop uninstall spinner.
 */
export function stopUninstallSpinner(s: ReturnType<typeof p.spinner>, success: boolean, savedMB: string): void {
  if (success) {
    s.stop(`${neon.acid('Packages purged!')} Saved ${neon.acid(savedMB + ' MB')}`);
  } else {
    s.stop(neon.fire('Some packages could not be removed.'));
  }
}

/**
 * Show skipped message.
 */
export function showSkipped(): void {
  p.log.info(neon.dim('Cleanup skipped — no packages were removed.'));
}

/**
 * Show completion message.
 */
export function showComplete(cleaned: boolean): void {
  console.log('');
  if (cleaned) {
    console.log(`  ${neon.cyan('╔══════════════════════════════════════════════════════════════╗')}`);
    console.log(`  ${neon.cyan('║')}  ${neon.acid('✓ REPOSITORY CLEANED. BUILD TIMES OPTIMIZED.')}              ${neon.cyan('║')}`);
    console.log(`  ${neon.cyan('║')}  ${neon.dim('Run BloatRay periodically to keep deps lean.')}              ${neon.cyan('║')}`);
    console.log(`  ${neon.cyan('╚══════════════════════════════════════════════════════════════╝')}`);
    console.log('');
  }
}

/**
 * Show the outro.
 */
export function showOutro(): void {
  p.outro(
    neon.dim('Built with ') + pc.bold(pc.red('♥')) + neon.dim(' by ') + neon.glow('Aarif Khan') +
    neon.dim(' // DX-Ray Hackathon')
  );
}

/**
 * Show a cyberpunk separator.
 */
export function showSeparator(): void {
  cyberSeparator();
}

/**
 * Show error.
 */
export function showError(message: string): void {
  p.log.error(`${BADGE.WARN} ${neon.fire(message)}`);
}

/**
 * Goodbye screen.
 */
export function showGoodbye(): void {
  console.log('');
  console.log(`  ${neon.cyan('╔══════════════════════════════════════════════════════════════╗')}`);
  console.log(`  ${neon.cyan('║')}  ${neon.hot('>>> SESSION TERMINATED')}                                      ${neon.cyan('║')}`);
  console.log(`  ${neon.cyan('║')}  ${neon.dim('Thank you for using BloatRay.')}                                ${neon.cyan('║')}`);
  console.log(`  ${neon.cyan('╚══════════════════════════════════════════════════════════════╝')}`);
  console.log('');
  p.outro(neon.glow('— BloatRay') + neon.dim(' by ') + neon.glow('Aarif Khan'));
}

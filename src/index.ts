#!/usr/bin/env node

import { Command } from 'commander';
import * as p from '@clack/prompts';
import * as path from 'path';
import pc from 'picocolors';
import { scanProject } from './scanner';
import { removePackages } from './fixer';
import {
  showBoot,
  showTargetDir,
  promptFolderSelect,
  showActionMenu,
  createScanSpinner,
  stopScanSpinner,
  showResults,
  promptCleanup,
  createUninstallSpinner,
  stopUninstallSpinner,
  showSkipped,
  showComplete,
  showOutro,
  showSeparator,
  showError,
  showGoodbye,
} from './ui';

const VERSION = '1.0.0';

/**
 * Resolve a directory path to an absolute path.
 */
function resolveDir(dir: string): string {
  return path.resolve(process.cwd(), dir);
}

/**
 * Run the scan → visualize → (optionally) act pipeline.
 */
async function runScanPipeline(targetDir: string, autoFix: boolean): Promise<boolean> {
  showTargetDir(targetDir);

  // STEP 1: SCAN
  const spinner = createScanSpinner();
  const startTime = Date.now();

  let result;
  try {
    result = await scanProject(targetDir);
  } catch (err: any) {
    spinner.stop(pc.red('Scan failed'));
    showError(err.message || 'Unknown error during scan.');
    return false;
  }

  stopScanSpinner(spinner, Date.now() - startTime);

  // STEP 2: VISUALIZE
  showResults(result);

  // If no bloat or not auto-fixing, done
  if (result.unusedCount === 0 || !autoFix) {
    return true;
  }

  // STEP 3: ACT
  const shouldClean = await promptCleanup(result.unusedCount, result.totalBloatMB);

  if (!shouldClean) {
    showSkipped();
    return true;
  }

  const uninstallSpinner = createUninstallSpinner();
  const fixResult = await removePackages(result.unusedDeps, targetDir);
  stopUninstallSpinner(uninstallSpinner, fixResult.success, fixResult.savedMB);

  if (fixResult.failedPackages.length > 0) {
    p.log.warn(
      pc.yellow('Could not remove: ') + pc.dim(fixResult.failedPackages.join(', '))
    );
  }

  showComplete(true);
  return true;
}

/**
 * Main interactive loop: boot → pick folder → pick action → execute → loop.
 */
async function runInteractiveLoop(initialDir: string): Promise<void> {
  // BOOT
  showBoot();

  // FOLDER SELECT
  let targetDir = initialDir;

  const folder = await promptFolderSelect(initialDir);
  if (p.isCancel(folder)) {
    showGoodbye();
    process.exit(0);
  }
  targetDir = path.resolve(folder as string);

  // MAIN LOOP
  while (true) {
    showSeparator();

    const action = await showActionMenu(targetDir);

    if (p.isCancel(action) || action === 'exit') {
      showGoodbye();
      process.exit(0);
    }

    if (action === 'scan') {
      await runScanPipeline(targetDir, false);
    } else if (action === 'scan-fix') {
      await runScanPipeline(targetDir, true);
    } else if (action === 'change-dir') {
      const newFolder = await promptFolderSelect(resolveDir('.'));
      if (p.isCancel(newFolder)) {
        p.log.info(pc.dim('Folder change cancelled.'));
        continue;
      }
      targetDir = path.resolve(newFolder as string);
      p.log.success(
        `${pc.bold('Switched to:')} ${pc.bold(pc.cyan(path.basename(targetDir)))} ${pc.dim('(' + targetDir + ')')}`
      );
    }
  }
}

// ─── CLI Setup ───────────────────────────────────────────────────

const program = new Command();

program
  .name('bloatray')
  .description(
    'BloatRay — The Dependency X-Ray. Scan, visualize, and auto-clean unused dependency bloat.'
  )
  .version(VERSION, '-v, --version', 'Display BloatRay version');

program
  .command('scan')
  .description('Scan a project for unused dependencies and visualize bloat')
  .option('-d, --dir <path>', 'Target project directory', process.cwd())
  .option('--fix', 'Prompt to auto-remove unused packages after scan', false)
  .action(async (opts: { dir: string; fix: boolean }) => {
    showBoot();
    const resolved = resolveDir(opts.dir);
    await runScanPipeline(resolved, opts.fix);
    showOutro();
  });

program
  .command('fix')
  .description('Scan and prompt to auto-remove unused dependencies')
  .option('-d, --dir <path>', 'Target project directory', process.cwd())
  .action(async (opts: { dir: string }) => {
    showBoot();
    const resolved = resolveDir(opts.dir);
    await runScanPipeline(resolved, true);
    showOutro();
  });

program
  .command('interactive', { isDefault: true })
  .description('Launch the interactive BloatRay terminal')
  .option('-d, --dir <path>', 'Starting directory', process.cwd())
  .action(async (opts: { dir: string }) => {
    await runInteractiveLoop(resolveDir(opts.dir));
  });

program.parse(process.argv);

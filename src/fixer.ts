import { exec } from 'child_process';
import { UnusedPackage } from './scanner';

export interface FixResult {
  success: boolean;
  removedPackages: string[];
  failedPackages: string[];
  savedMB: string;
}

/**
 * Execute npm uninstall for the given list of unused packages.
 */
export async function removePackages(
  packages: UnusedPackage[],
  targetDir: string
): Promise<FixResult> {
  const packageNames = packages.map(p => p.name);
  const totalSavedBytes = packages.reduce((sum, p) => sum + p.sizeBytes, 0);
  const savedMB = (totalSavedBytes / (1024 * 1024)).toFixed(2);

  if (packageNames.length === 0) {
    return {
      success: true,
      removedPackages: [],
      failedPackages: [],
      savedMB: '0.00',
    };
  }

  // Split into deps and devDeps for proper uninstall flags
  const deps = packages.filter(p => p.type === 'dependency').map(p => p.name);
  const devDeps = packages.filter(p => p.type === 'devDependency').map(p => p.name);

  const removedPackages: string[] = [];
  const failedPackages: string[] = [];

  // Uninstall production dependencies
  if (deps.length > 0) {
    try {
      await execCommand(`npm uninstall ${deps.join(' ')}`, targetDir);
      removedPackages.push(...deps);
    } catch {
      // Try one by one if batch fails
      for (const dep of deps) {
        try {
          await execCommand(`npm uninstall ${dep}`, targetDir);
          removedPackages.push(dep);
        } catch {
          failedPackages.push(dep);
        }
      }
    }
  }

  // Uninstall dev dependencies
  if (devDeps.length > 0) {
    try {
      await execCommand(`npm uninstall ${devDeps.join(' ')}`, targetDir);
      removedPackages.push(...devDeps);
    } catch {
      // Try one by one if batch fails
      for (const dep of devDeps) {
        try {
          await execCommand(`npm uninstall ${dep}`, targetDir);
          removedPackages.push(dep);
        } catch {
          failedPackages.push(dep);
        }
      }
    }
  }

  return {
    success: failedPackages.length === 0,
    removedPackages,
    failedPackages,
    savedMB,
  };
}

/**
 * Execute a shell command and return its stdout.
 */
function execCommand(command: string, cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd, timeout: 120_000 }, (error: Error | null, stdout: string, stderr: string) => {
      if (error) {
        reject(new Error(stderr || error.message));
      } else {
        resolve(stdout);
      }
    });
  });
}

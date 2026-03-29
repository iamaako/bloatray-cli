import * as path from 'path';
import * as fs from 'fs/promises';
import depcheck from 'depcheck';

export interface UnusedPackage {
  name: string;
  sizeBytes: number;
  sizeMB: string;
  type: 'dependency' | 'devDependency';
}

export interface ScanResult {
  unusedDeps: UnusedPackage[];
  totalBloatBytes: number;
  totalBloatMB: string;
  totalDepsCount: number;
  unusedCount: number;
  healthScore: number;
}

/**
 * Recursively calculate the size of a directory in bytes.
 */
async function getDirSize(dirPath: string): Promise<number> {
  let totalSize = 0;

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        totalSize += await getDirSize(fullPath);
      } else if (entry.isFile()) {
        try {
          const stat = await fs.stat(fullPath);
          totalSize += stat.size;
        } catch {
          // Skip files that can't be stat'd
        }
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return totalSize;
}

/**
 * Convert bytes to a human-readable MB string.
 */
function bytesToMB(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(2);
}

/**
 * Calculate the health score (0-100) based on the ratio of used vs unused deps.
 */
function calculateHealthScore(totalDeps: number, unusedCount: number): number {
  if (totalDeps === 0) return 100;
  const usedRatio = (totalDeps - unusedCount) / totalDeps;
  return Math.round(usedRatio * 100);
}

/**
 * Main scan function using depcheck to find unused dependencies.
 */
export async function scanProject(targetDir: string): Promise<ScanResult> {
  const nodeModulesPath = path.join(targetDir, 'node_modules');
  const packageJsonPath = path.join(targetDir, 'package.json');

  // Verify package.json exists
  try {
    await fs.access(packageJsonPath);
  } catch {
    throw new Error(
      `No package.json found in "${targetDir}". Please run BloatRay from a Node.js project root.`
    );
  }

  // Check if node_modules exists
  let nodeModulesExist = true;
  try {
    await fs.access(nodeModulesPath);
  } catch {
    nodeModulesExist = false;
  }

  // Read package.json to count total dependencies
  const pkgRaw = await fs.readFile(packageJsonPath, 'utf-8');
  const pkg = JSON.parse(pkgRaw);
  const allDeps = Object.keys(pkg.dependencies || {});
  const allDevDeps = Object.keys(pkg.devDependencies || {});
  const totalDepsCount = allDeps.length + allDevDeps.length;

  // Configure depcheck
  const options: depcheck.Options = {
    ignoreBinPackage: false,
    skipMissing: true,
    ignorePatterns: ['dist', 'build', 'coverage', '.next', '.nuxt', 'out'],
    ignoreMatches: [
      'typescript',
      '@types/*',
      'ts-node',
      'tslib',
    ],
    parsers: {
      '**/*.ts': depcheck.parser.typescript,
      '**/*.tsx': depcheck.parser.typescript,
      '**/*.js': depcheck.parser.es6,
      '**/*.jsx': depcheck.parser.jsx,
    },
    detectors: [
      depcheck.detector.requireCallExpression,
      depcheck.detector.importDeclaration,
      depcheck.detector.exportDeclaration,
      depcheck.detector.gruntLoadTaskCallExpression,
    ],
    specials: [
      depcheck.special.eslint,
      depcheck.special.webpack,
      depcheck.special.babel,
    ],
  };

  // Run depcheck
  const results = await depcheck(targetDir, options);

  const unusedDependencies = results.dependencies || [];
  const unusedDevDependencies = results.devDependencies || [];

  // Build the unused packages list with sizes
  const unusedDeps: UnusedPackage[] = [];

  for (const depName of unusedDependencies) {
    const depPath = path.join(nodeModulesPath, depName);
    let sizeBytes = 0;

    if (nodeModulesExist) {
      sizeBytes = await getDirSize(depPath);
    }

    unusedDeps.push({
      name: depName,
      sizeBytes,
      sizeMB: bytesToMB(sizeBytes),
      type: 'dependency',
    });
  }

  for (const depName of unusedDevDependencies) {
    const depPath = path.join(nodeModulesPath, depName);
    let sizeBytes = 0;

    if (nodeModulesExist) {
      sizeBytes = await getDirSize(depPath);
    }

    unusedDeps.push({
      name: depName,
      sizeBytes,
      sizeMB: bytesToMB(sizeBytes),
      type: 'devDependency',
    });
  }

  // Sort by size descending (biggest bloat first)
  unusedDeps.sort((a, b) => b.sizeBytes - a.sizeBytes);

  const totalBloatBytes = unusedDeps.reduce((sum, dep) => sum + dep.sizeBytes, 0);
  const unusedCount = unusedDeps.length;
  const healthScore = calculateHealthScore(totalDepsCount, unusedCount);

  return {
    unusedDeps,
    totalBloatBytes,
    totalBloatMB: bytesToMB(totalBloatBytes),
    totalDepsCount,
    unusedCount,
    healthScore,
  };
}

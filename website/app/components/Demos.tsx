const demos = [
  {
    name: 'demo-1-heavy-bloat',
    desc: '8 unused packages, 8.9 MB bloat',
    score: 20,
    color: '#ff3131',
    label: 'CRITICAL',
    packages: ['moment', 'axios', 'lodash', 'uuid', 'chalk', 'cors', 'nodemon', 'jest'],
  },
  {
    name: 'demo-2-clean-project',
    desc: 'Zero bloat, all deps used',
    score: 100,
    color: '#39ff14',
    label: 'OPTIMAL',
    packages: ['express', 'dotenv'],
  },
  {
    name: 'demo-3-devdep-bloat',
    desc: '6 unused devDependencies, 18.4 MB',
    score: 14,
    color: '#ff3131',
    label: 'CRITICAL',
    packages: ['prettier', 'sinon', 'eslint', 'mocha', 'lint-staged', 'husky'],
  },
  {
    name: 'demo-4-typescript-bloat',
    desc: 'TypeScript project with unused deps',
    score: 40,
    color: '#ff00ff',
    label: 'DEGRADED',
    packages: ['rxjs', 'typeorm', 'class-validator', 'moment'],
  },
  {
    name: 'demo-5-react-bloat',
    desc: '15 unused packages, 137 MB',
    score: 6,
    color: '#ff3131',
    label: 'CRITICAL',
    packages: ['three', '@mui/material', 'firebase', 'chart.js', 'framer-motion'],
  },
  {
    name: 'demo-6-empty-project',
    desc: 'No dependencies at all',
    score: 100,
    color: '#39ff14',
    label: 'OPTIMAL',
    packages: [],
  },
];

function ScoreBar({ score, color }: { score: number; color: string }) {
  const filled = Math.round((score / 100) * 20);
  const empty = 20 - filled;
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <span style={{ color }}>{'\u2588'.repeat(filled)}</span>
      <span className="text-[#1e1e2e]">{'\u2591'.repeat(empty)}</span>
      <span style={{ color }} className="font-bold">{score}%</span>
    </div>
  );
}

export default function Demos() {
  return (
    <section id="demos" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-xs tracking-[4px] uppercase text-[#6b6b80] mb-3">Test Projects</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            <span className="neon-green">6 Demo</span>{' '}
            <span className="text-[#e0e0e8]">Projects Included</span>
          </h2>
          <p className="text-sm text-[#6b6b80] mt-3 max-w-lg mx-auto">
            Each demo simulates a different real-world bloat scenario. All are pre-configured and ready to scan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {demos.map((d) => (
            <div key={d.name} className="cyber-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#e0e0e8] truncate">{d.name}</h3>
                <span
                  className="badge text-[10px]"
                  style={{
                    color: d.color,
                    background: `${d.color}10`,
                    border: `1px solid ${d.color}30`,
                  }}
                >
                  {d.label}
                </span>
              </div>
              <p className="text-xs text-[#6b6b80] mb-3">{d.desc}</p>
              <ScoreBar score={d.score} color={d.color} />
              {d.packages.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {d.packages.slice(0, 4).map((pkg) => (
                    <span key={pkg} className="text-[10px] px-2 py-0.5 bg-[#0d0d15] border border-[#1e1e2e] text-[#6b6b80]">
                      {pkg}
                    </span>
                  ))}
                  {d.packages.length > 4 && (
                    <span className="text-[10px] px-2 py-0.5 text-[#6b6b80]">
                      +{d.packages.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="neon-line max-w-5xl mx-auto mt-16 sm:mt-24" />
    </section>
  );
}

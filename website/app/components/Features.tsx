const features = [
  {
    icon: '01',
    title: 'SCAN',
    color: '#00f0ff',
    desc: 'Uses depcheck to analyze package.json + source code imports. Calculates real disk size of each unused package inside node_modules.',
    tags: ['depcheck', 'node_modules', 'import analysis'],
  },
  {
    icon: '02',
    title: 'VISUALIZE',
    color: '#ff00ff',
    desc: 'Renders a cyberpunk CLI dashboard with a Health Score (0-100%), total MB of bloat, colored impact bars, and a ranked table.',
    tags: ['health score', 'impact bars', 'ranked table'],
  },
  {
    icon: '03',
    title: 'ACT',
    color: '#39ff14',
    desc: 'Prompts the user to auto-remove unused packages via npm uninstall. One click to clean your entire project.',
    tags: ['npm uninstall', '1-click cleanup', 'auto-fix'],
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-xs tracking-[4px] uppercase text-[#6b6b80] mb-3">The Pipeline</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            <span className="neon-cyan">3 Steps</span>{' '}
            <span className="text-[#e0e0e8]">to Zero Bloat</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="cyber-card p-4 sm:p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="text-xs font-bold px-2 py-1 border"
                  style={{ color: f.color, borderColor: f.color, textShadow: `0 0 8px ${f.color}` }}
                >
                  {f.icon}
                </span>
                <h3 className="text-lg font-bold tracking-wider" style={{ color: f.color, textShadow: `0 0 8px ${f.color}` }}>
                  {f.title}
                </h3>
              </div>
              <p className="text-sm text-[#6b6b80] leading-relaxed mb-4 flex-1">{f.desc}</p>
              <div className="flex flex-wrap gap-2">
                {f.tags.map((tag) => (
                  <span key={tag} className="badge bg-[#1a1a2e] text-[#6b6b80] border border-[#1e1e2e]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="neon-line max-w-5xl mx-auto mt-16 sm:mt-24" />
    </section>
  );
}

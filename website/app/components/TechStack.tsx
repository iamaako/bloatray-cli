const stack = [
  { name: 'Node.js', desc: 'Runtime', color: '#39ff14' },
  { name: 'TypeScript', desc: 'Language', color: '#00f0ff' },
  { name: 'depcheck', desc: 'Scanner engine', color: '#ff00ff' },
  { name: 'Commander.js', desc: 'CLI framework', color: '#00f0ff' },
  { name: '@clack/prompts', desc: 'Interactive UI', color: '#ff00ff' },
  { name: 'picocolors', desc: 'Terminal colors', color: '#39ff14' },
];

const questions = [
  {
    q: 'What DX problem am I scanning?',
    a: 'Hidden dependency bloat and unused packages that slow down CI/CD and developer onboarding.',
    icon: '?',
    color: '#00f0ff',
  },
  {
    q: 'What does my tool output?',
    a: 'A CLI dashboard highlighting unused packages, their disk size impact, and a 1-click auto-cleanup prompt.',
    icon: '>',
    color: '#ff00ff',
  },
  {
    q: 'Where does the data come from?',
    a: 'Project package.json, local node_modules size calculation, and source code import analysis via depcheck.',
    icon: 'i',
    color: '#39ff14',
  },
];

export default function TechStack() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* 3 Core Questions */}
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-xs tracking-[4px] uppercase text-[#6b6b80] mb-3">Hackathon Track E</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            <span className="neon-yellow">3 Core</span>{' '}
            <span className="text-[#e0e0e8]">Questions</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-20">
          {questions.map((item) => (
            <div key={item.q} className="cyber-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-8 h-8 flex items-center justify-center border font-bold text-sm"
                  style={{ color: item.color, borderColor: item.color, textShadow: `0 0 8px ${item.color}` }}
                >
                  {item.icon}
                </span>
                <h3 className="text-sm font-bold text-[#e0e0e8]">{item.q}</h3>
              </div>
              <p className="text-sm text-[#6b6b80] leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[4px] uppercase text-[#6b6b80] mb-3">Built With</p>
          <h2 className="text-2xl font-bold text-[#e0e0e8]">Tech Stack</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {stack.map((s) => (
            <div key={s.name} className="cyber-card p-4 text-center">
              <p className="text-sm font-bold mb-1" style={{ color: s.color }}>{s.name}</p>
              <p className="text-[10px] text-[#6b6b80]">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="neon-line max-w-5xl mx-auto mt-16 sm:mt-24" />
    </section>
  );
}

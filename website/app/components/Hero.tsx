export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-14 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Logo */}
        <div className="mb-8 select-none">
          <div className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter neon-cyan" style={{textShadow: '0 0 20px rgba(0,240,255,0.5), 0 0 40px rgba(0,240,255,0.2)'}}>
            BLOAT<span className="neon-magenta">RAY</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-[#00f0ff]" />
            <span className="text-[10px] sm:text-xs tracking-[6px] uppercase text-[#6b6b80]">dependency x-ray</span>
            <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-[#ff00ff]" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          <span className="neon-cyan">The Dependency</span>{' '}
          <span className="neon-magenta">X-Ray</span>
        </h1>

        <p className="text-sm sm:text-lg md:text-xl text-[#6b6b80] max-w-2xl mx-auto mb-4 px-2">
          Scan, visualize, and auto-clean unused dependency bloat from your Node.js projects.
        </p>

        <p className="text-xs sm:text-sm text-[#6b6b80] mb-8 sm:mb-10">
          Built by <span className="neon-magenta font-bold">Aarif Khan</span> for the{' '}
          <span className="text-[#e0e0e8] font-semibold">DX-Ray Hackathon</span>{' '}
          <span className="text-[#6b6b80]">| Track E</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
          <a href="#install" className="cyber-btn">
            <span>&#9889;</span> Install Now
          </a>
          <a href="https://github.com/iamaako/bloatray-cli" target="_blank" rel="noopener noreferrer" className="cyber-btn cyber-btn-mag">
            <span>&#9733;</span> View on GitHub
          </a>
        </div>

        {/* Terminal Preview */}
        <div className="cyber-card p-0 text-left max-w-2xl mx-auto overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1e1e2e] bg-[#0d0d15]">
            <div className="w-3 h-3 rounded-full bg-[#ff3131]" />
            <div className="w-3 h-3 rounded-full bg-[#ffe600]" />
            <div className="w-3 h-3 rounded-full bg-[#39ff14]" />
            <span className="ml-2 text-xs text-[#6b6b80]">bloatray-cli</span>
          </div>
          <div className="p-4 text-xs sm:text-sm font-mono leading-relaxed">
            <div><span className="neon-cyan">$</span> <span className="neon-green">bloatray</span></div>
            <div className="mt-2 text-[#6b6b80]">  Scanning dependency tree...</div>
            <div className="mt-1 text-[#6b6b80]">  Analyzing source imports via depcheck...</div>
            <div className="mt-2">
              <span className="neon-red font-bold">  BLOAT</span>
              <span className="text-[#e0e0e8]"> 8 unused packages detected</span>
            </div>
            <div className="mt-2">
              <span className="text-[#e0e0e8]">  Health Score</span>
            </div>
            <div className="mt-1">
              <span className="neon-red">  {'█'.repeat(5)}</span>
              <span className="text-[#2a2a3a]">{'░'.repeat(20)}</span>
              <span className="neon-red font-bold"> 20%</span>
              <span className="text-[#6b6b80]"> // CRITICAL</span>
            </div>
            <div className="mt-2">
              <span className="text-[#6b6b80]">  Total bloat: </span>
              <span className="neon-magenta font-bold">8.90 MB</span>
              <span className="text-[#6b6b80]"> across 8 packages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
    </section>
  );
}

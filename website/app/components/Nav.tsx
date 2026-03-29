export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1e1e2e] bg-[#0a0a0f]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="neon-cyan font-bold text-lg tracking-wider">BLOATRAY</span>
          <span className="text-[#6b6b80] text-xs">v1.0</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a href="#features" className="text-[#6b6b80] hover:text-[#00f0ff] transition-colors hidden sm:inline">Features</a>
          <a href="#install" className="text-[#6b6b80] hover:text-[#00f0ff] transition-colors hidden sm:inline">Install</a>
          <a href="#demos" className="text-[#6b6b80] hover:text-[#00f0ff] transition-colors hidden sm:inline">Demos</a>
          <a
            href="https://github.com/iamaako/bloatray-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-btn"
            style={{ padding: '6px 16px', fontSize: '12px' }}
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

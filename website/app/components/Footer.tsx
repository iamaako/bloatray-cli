export default function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-[#1e1e2e]">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="neon-cyan font-bold text-lg tracking-wider mb-1">BLOATRAY</p>
            <p className="text-xs text-[#6b6b80]">The Dependency X-Ray | v1.0</p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://github.com/iamaako/bloatray-cli"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6b6b80] hover:text-[#00f0ff] transition-colors"
            >
              GitHub
            </a>
            <a href="#install" className="text-[#6b6b80] hover:text-[#00f0ff] transition-colors">
              Install
            </a>
            <a href="#features" className="text-[#6b6b80] hover:text-[#00f0ff] transition-colors">
              Features
            </a>
            <a href="#demos" className="text-[#6b6b80] hover:text-[#00f0ff] transition-colors">
              Demos
            </a>
          </div>
        </div>

        <div className="neon-line my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6b6b80]">
          <p>
            Built with <span className="neon-red">&#9829;</span> by{' '}
            <span className="neon-magenta font-bold">Aarif Khan</span> for the DX-Ray Hackathon
          </p>
          <p>Track E: Dependency X-Ray | MIT License</p>
        </div>
      </div>
    </footer>
  );
}

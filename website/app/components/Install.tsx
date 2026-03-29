'use client';

import { useState } from 'react';

function CopyBlock({ command, label, badge, badgeColor, description }: {
  command: string;
  label: string;
  badge: string;
  badgeColor: string;
  description?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      // Fallback for non-HTTPS contexts
      const textarea = document.createElement('textarea');
      textarea.value = command;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cyber-card p-4 sm:p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <span
          className="badge text-[10px] sm:text-[11px]"
          style={{ color: badgeColor, background: `${badgeColor}15`, border: `1px solid ${badgeColor}40` }}
        >
          {badge}
        </span>
        <h3 className="text-xs sm:text-sm font-bold text-[#e0e0e8]">{label}</h3>
      </div>
      <div className="cyber-code flex items-center justify-between gap-3">
        <code className="text-[11px] sm:text-[13px] break-all flex-1">{command}</code>
        <button
          onClick={handleCopy}
          className="shrink-0 px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider border transition-all duration-200"
          style={{
            color: copied ? '#0a0a0f' : '#00f0ff',
            borderColor: '#00f0ff',
            background: copied ? '#00f0ff' : 'transparent',
            boxShadow: copied ? '0 0 12px rgba(0,240,255,0.4)' : 'none',
          }}
        >
          {copied ? '\u2714 Copied!' : 'Copy'}
        </button>
      </div>
      {description && (
        <p className="text-[10px] sm:text-xs text-[#6b6b80] mt-3">{description}</p>
      )}
    </div>
  );
}

export default function Install() {
  return (
    <section id="install" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs tracking-[4px] uppercase text-[#6b6b80] mb-3">Get Started</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            <span className="neon-magenta">One Command.</span>{' '}
            <span className="text-[#e0e0e8]">Zero Friction.</span>
          </h2>
        </div>

        <CopyBlock
          command="irm https://raw.githubusercontent.com/iamaako/bloatray-cli/main/install.ps1 | iex"
          label="PowerShell One-Liner"
          badge="RECOMMENDED"
          badgeColor="#00f0ff"
          description="Downloads, installs, builds, sets up test projects, and auto-launches the interactive terminal."
        />

        <CopyBlock
          command="curl -o install.cmd https://raw.githubusercontent.com/iamaako/bloatray-cli/main/install.cmd && install.cmd"
          label="Command Prompt"
          badge="CMD"
          badgeColor="#ff00ff"
        />

        <CopyBlock
          command="git clone https://github.com/iamaako/bloatray-cli.git && cd bloatray-cli && npm install && npm run build && npm link && bloatray"
          label="Git Clone + Setup"
          badge="MANUAL"
          badgeColor="#39ff14"
        />

        {/* After install */}
        <div className="cyber-card p-4 sm:p-6 border-[#00f0ff]/30">
          <h3 className="text-xs sm:text-sm font-bold neon-cyan mb-4">After Install — Run Anytime</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Interactive mode', cmd: 'bloatray' },
              { label: 'Scan a project', cmd: 'bloatray scan --dir ./my-project' },
              { label: 'Scan + auto-fix', cmd: 'bloatray fix --dir ./my-project' },
              { label: 'Without npm link', cmd: 'node dist/index.js' },
            ].map((item) => (
              <div key={item.cmd}>
                <p className="text-[10px] sm:text-xs text-[#6b6b80] mb-2">{item.label}</p>
                <div className="cyber-code text-[11px] sm:text-xs">{item.cmd}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="neon-line max-w-5xl mx-auto mt-16 sm:mt-24" />
    </section>
  );
}

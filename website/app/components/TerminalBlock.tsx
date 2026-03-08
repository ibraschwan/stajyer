"use client";

import { useState } from "react";

interface TerminalBlockProps {
  title?: string;
  children: string;
  copyable?: string;
  language?: string;
}

export default function TerminalBlock({
  title,
  children,
  copyable,
}: TerminalBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!copyable) return;
    navigator.clipboard.writeText(copyable);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="terminal-glow rounded-lg border border-terminal-border bg-terminal-bg overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-terminal-border">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-muted font-mono">{title}</span>
          {copyable && (
            <button
              onClick={handleCopy}
              className="text-xs text-muted hover:text-foreground transition-colors font-mono cursor-pointer"
            >
              {copied ? "copied!" : "copy"}
            </button>
          )}
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}

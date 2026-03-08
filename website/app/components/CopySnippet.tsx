"use client";

import { useState } from "react";

export default function CopySnippet({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-3 px-4 py-2.5 rounded-lg bg-terminal-bg border border-terminal-border hover:border-accent/30 transition-all font-mono text-sm text-muted hover:text-foreground cursor-pointer"
    >
      <span className="text-accent/60">$</span>
      <span>{text}</span>
      <span className="ml-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? "copied!" : "click to copy"}
      </span>
    </button>
  );
}

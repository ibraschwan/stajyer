"use client";

import { useState } from "react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-muted hover:text-foreground transition-colors cursor-pointer"
        aria-label="Toggle menu"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {open ? (
            <path d="M4 4l12 12M16 4L4 16" />
          ) : (
            <path d="M3 5h14M3 10h14M3 15h14" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-card-border py-4 px-6 space-y-3">
          <a
            href="#how-it-works"
            onClick={() => setOpen(false)}
            className="block text-sm text-muted hover:text-foreground transition-colors"
          >
            How it works
          </a>
          <a
            href="#comparison"
            onClick={() => setOpen(false)}
            className="block text-sm text-muted hover:text-foreground transition-colors"
          >
            Compare
          </a>
          <a
            href="#get-started"
            onClick={() => setOpen(false)}
            className="block text-sm text-muted hover:text-foreground transition-colors"
          >
            Pricing
          </a>
          <a
            href="https://github.com/ibraschwan/stajyer"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-muted hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      )}
    </div>
  );
}

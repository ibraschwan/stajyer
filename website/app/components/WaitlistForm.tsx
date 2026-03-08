"use client";

import { useState, type FormEvent } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // TODO: Connect to your email service (Resend, ConvertKit, etc.)
    // For now, store in localStorage as a placeholder
    try {
      const existing = JSON.parse(
        localStorage.getItem("stajyer_waitlist") || "[]"
      );
      existing.push({ email, date: new Date().toISOString() });
      localStorage.setItem("stajyer_waitlist", JSON.stringify(existing));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-sm text-accent">
        <span>✓</span>
        <span>You&apos;re on the list. We&apos;ll be in touch.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm">
      <input
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 px-3 py-2 rounded-lg bg-terminal-bg border border-terminal-border text-sm font-mono text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-colors"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm font-medium hover:bg-accent/20 transition-colors cursor-pointer"
      >
        Join
      </button>
    </form>
  );
}

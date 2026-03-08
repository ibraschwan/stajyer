import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stajyer.app"),
  title: {
    default: "Stajyer — Let your intern take over your job",
    template: "%s | Stajyer",
  },
  description:
    "Orchestrate multiple AI coding agents (Claude Code, Codex, Cursor) without databases or heavy frameworks. Auto-continue, ownership guards, markdown state. Free & open source.",
  keywords: [
    "AI agent orchestration",
    "Claude Code",
    "Codex",
    "Cursor",
    "multi-agent",
    "coding agents",
    "developer tools",
    "CLI tool",
    "open source",
    "AI coding",
    "agent coordination",
    "stajyer",
  ],
  authors: [{ name: "Stajyer" }],
  creator: "Stajyer",
  publisher: "Stajyer",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Stajyer — Let your intern take over your job",
    description:
      "Orchestrate multiple AI coding agents. Auto-continue, ownership guards, markdown state. No database needed. Free & open source CLI.",
    url: "https://stajyer.app",
    siteName: "Stajyer",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stajyer — AI Agent Orchestration Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stajyer — Let your intern take over your job",
    description:
      "Orchestrate multiple AI coding agents. Auto-continue, ownership guards, markdown state. Free & open source.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://stajyer.app",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Stajyer",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Linux, Windows",
  description:
    "Orchestrate multiple AI coding agents (Claude Code, Codex, Cursor) without databases or heavy frameworks.",
  url: "https://stajyer.app",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  license: "https://opensource.org/licenses/MIT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Stajyer — AI Agent Orchestration Tool";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0f",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Dot grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Amber glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Logo text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "#e5e5e5",
              fontFamily: "monospace",
            }}
          >
            stajyer
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: 800,
            color: "#e5e5e5",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "900px",
          }}
        >
          Let your{" "}
          <span style={{ color: "#f59e0b", textDecoration: "underline" }}>
            intern
          </span>{" "}
          take over your job.
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "24px",
            color: "#71717a",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          AI Agent Orchestration — Free & Open Source
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            marginTop: "48px",
            padding: "16px 32px",
            borderRadius: "12px",
            border: "1px solid #1e1e2a",
            background: "#111118",
          }}
        >
          {[
            ["3", "Agents"],
            ["17", "Tasks"],
            ["115", "Tests"],
            ["0", '"Continue"'],
          ].map(([num, label]) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{ fontSize: "28px", fontWeight: 800, color: "#f59e0b" }}
              >
                {num}
              </div>
              <div style={{ fontSize: "14px", color: "#71717a" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "18px",
            color: "#71717a",
            fontFamily: "monospace",
          }}
        >
          stajyer.app
        </div>
      </div>
    ),
    { ...size }
  );
}

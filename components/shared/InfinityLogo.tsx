"use client";

interface Props {
  height?: number;
  color?: string;
  showText?: boolean;
  fontSize?: number;
}

export default function InfinityLogo({ fontSize = 16 }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
      <span style={{ fontWeight: 800, fontSize, letterSpacing: "0.5px", color: "#FFFFFF", lineHeight: 1 }}>AI</span>
      <span style={{ display: "inline-block", width: 16, height: 3, background: "#FF6B6B", flexShrink: 0 }} />
      <span style={{ fontWeight: 600, fontSize, letterSpacing: "0.5px", color: "#FFFFFF", lineHeight: 1 }}>LEVERAGE AUTOMATION</span>
    </div>
  );
}

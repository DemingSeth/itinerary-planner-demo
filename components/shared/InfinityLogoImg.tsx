import { BRAND } from "@/lib/helpers";

interface Props {
  height?: number;
  showText?: boolean;
  fontSize?: number;
}

export default function InfinityLogoImg({ fontSize = 16 }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
      <span style={{ fontWeight: 800, fontSize, letterSpacing: "0.5px", color: BRAND.navy, lineHeight: 1 }}>AI</span>
      <span style={{ display: "inline-block", width: 16, height: 3, background: BRAND.teal, flexShrink: 0 }} />
      <span style={{ fontWeight: 600, fontSize, letterSpacing: "0.5px", color: BRAND.navy, lineHeight: 1 }}>LEVERAGE AUTOMATION</span>
    </div>
  );
}

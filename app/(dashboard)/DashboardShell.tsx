"use client";

import { useRouter } from "next/navigation";
import type { TourHostRow } from "@/lib/types";
import { BRAND } from "@/lib/helpers";
import DemoModeBanner from "@/components/shared/DemoModeBanner";

interface Props {
  children: React.ReactNode;
  tourHost: TourHostRow | null;
}

export default function DashboardShell({ children, tourHost }: Props) {
  const router = useRouter();
  const initials = tourHost?.initials ||
    (tourHost?.name || "TH").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
      <DemoModeBanner />
      {/* Top nav */}
      <header style={{ background: BRAND.navy, padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div
          onClick={() => router.push("/dashboard")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: "0.5px", color: "#FFFFFF", lineHeight: 1 }}>AI</span>
            <span style={{ display: "inline-block", width: 16, height: 3, background: "#FF6B6B", flexShrink: 0 }} />
            <span style={{ fontWeight: 600, fontSize: 17, letterSpacing: "0.5px", color: "#FFFFFF", lineHeight: 1 }}>LEVERAGE AUTOMATION</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: BRAND.teal,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
            }}>
              {initials}
            </div>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
              {tourHost?.name}
            </span>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1, padding: 24, maxWidth: 1400, width: "100%", margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}

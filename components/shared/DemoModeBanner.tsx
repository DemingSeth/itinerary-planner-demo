"use client";

import { useState } from "react";
import { resetDemo } from "@/lib/demo-store";

export default function DemoModeBanner() {
  const [justReset, setJustReset] = useState(false);

  function handleReset() {
    resetDemo();
    setJustReset(true);
    setTimeout(() => setJustReset(false), 2000);
  }

  return (
    <div style={{
      background: "#f1f5f9",
      borderBottom: "1px solid #e2e8f0",
      color: "#64748b",
      padding: "5px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      fontSize: 12,
      fontFamily: "'IBM Plex Sans', sans-serif",
      flexShrink: 0,
      flexWrap: "wrap",
    }}>
      <span>Demo mode: changes reset when you close this tab.</span>
      <button
        onClick={handleReset}
        style={{
          background: "#fff",
          color: "#475569",
          border: "1px solid #e2e8f0",
          borderRadius: 6,
          padding: "2px 10px",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
        }}
      >
        {justReset ? "Demo reset" : "Reset demo"}
      </button>
    </div>
  );
}

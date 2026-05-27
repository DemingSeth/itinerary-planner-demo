"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDemoMode, setDemoMode } from "@/lib/demoMode";

export default function DemoModeBanner() {
  const isDemo = useDemoMode();
  const router = useRouter();

  if (!isDemo) return null;

  async function handleExit() {
    setDemoMode(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div style={{
      background: "#FF6B6B",
      color: "#fff",
      padding: "7px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: 13,
      fontWeight: 600,
      fontFamily: "'IBM Plex Sans', sans-serif",
      flexShrink: 0,
      zIndex: 50,
    }}>
      <span>Demo Mode — Changes are not saved. Refresh to reset.</span>
      <button
        onClick={handleExit}
        style={{
          background: "rgba(0,0,0,0.18)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.35)",
          borderRadius: 6,
          padding: "3px 12px",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
        }}
      >
        Exit Demo
      </button>
    </div>
  );
}

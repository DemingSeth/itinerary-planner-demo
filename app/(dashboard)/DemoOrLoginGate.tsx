"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "./DashboardShell";
import { isDemoMode, getDemoUser, DEMO_TOUR_HOST } from "@/lib/demoMode";
import type { TourHostRow } from "@/lib/types";

export default function DemoOrLoginGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? sessionStorage.getItem("demo_mode") : "(no window)";
    const demo = isDemoMode();
    console.log("[DemoOrLoginGate] mounted — raw sessionStorage value:", raw, "| isDemoMode():", demo);
    if (!demo) {
      console.log("[DemoOrLoginGate] demo=false → calling router.replace('/login')");
      router.replace("/login");
    } else {
      console.log("[DemoOrLoginGate] demo=true → rendering DashboardShell");
    }
    setIsDemo(demo);
    setReady(true);
  }, [router]);

  if (!ready || !isDemo) return null;

  return (
    <DashboardShell
      user={getDemoUser()}
      tourHost={DEMO_TOUR_HOST as TourHostRow}
    >
      {children}
    </DashboardShell>
  );
}

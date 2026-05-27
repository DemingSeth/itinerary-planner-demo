"use client";

import { useState, useEffect } from "react";
import type { TourHostRow } from "@/lib/types";

const DEMO_KEY = "demo_mode";

export const DEMO_USER_ID = "66e70f80-b314-42f4-8233-e49e4abe4f05";

export function getDemoUser() {
  return {
    id: DEMO_USER_ID,
    email: "demo@aileverageautomation.com",
  };
}

export const DEMO_TOUR_HOST: TourHostRow = {
  id: DEMO_USER_ID,
  name: "Demo Host",
  email: "demo@aileverageautomation.com",
  phone: null,
  initials: "DH",
  company: "AI Leverage Automation",
  created_at: new Date(0).toISOString(),
};

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(DEMO_KEY) === "true";
}

export function setDemoMode(value: boolean): void {
  if (typeof window === "undefined") return;
  if (value) sessionStorage.setItem(DEMO_KEY, "true");
  else sessionStorage.removeItem(DEMO_KEY);
}

export function fakeId(): string {
  return crypto.randomUUID();
}

export function useDemoMode(): boolean {
  const [demo, setDemo] = useState(false);
  useEffect(() => {
    setDemo(isDemoMode());
  }, []);
  return demo;
}

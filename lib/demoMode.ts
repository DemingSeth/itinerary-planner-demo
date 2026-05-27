"use client";

import { useState, useEffect } from "react";

const DEMO_KEY = "demo_mode";

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

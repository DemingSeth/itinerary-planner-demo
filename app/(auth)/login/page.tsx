"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import InfinityLogoImg from "@/components/shared/InfinityLogoImg";
import { BRAND } from "@/lib/helpers";
import { setDemoMode } from "@/lib/demoMode";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  function handleDemoLogin() {
    setDemoLoading(true);
    setDemoMode(true);
    router.push("/dashboard");
  }

  const inp: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
    color: "#1e293b",
    fontFamily: "inherit",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: BRAND.navy, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
          <div style={{ padding: "32px 32px 24px", textAlign: "center", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <InfinityLogoImg fontSize={24} />
            </div>
            <div style={{ marginTop: 10, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: "#94a3b8", letterSpacing: "0.5px" }}>
              Itinerary Planner
            </div>
          </div>

          <div style={{ padding: "28px 32px 32px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: BRAND.navy, margin: "0 0 24px" }}>
              Sign in
            </h2>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>Email</label>
                <input
                  style={inp}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>Password</label>
                <input
                  style={inp}
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div style={{ background: "#fee2e2", color: "#b91c1c", borderRadius: 8, padding: "10px 14px", fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || demoLoading}
                style={{
                  background: BRAND.navy,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 0",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: (loading || demoLoading) ? "not-allowed" : "pointer",
                  opacity: (loading || demoLoading) ? 0.7 : 1,
                  fontFamily: "inherit",
                  marginTop: 4,
                }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Demo access */}
            <div style={{ margin: "20px 0 4px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              <span style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading || demoLoading}
              style={{
                width: "100%",
                background: "#fff",
                color: BRAND.navy,
                border: `1.5px solid #e2e8f0`,
                borderRadius: 8,
                padding: "11px 0",
                fontSize: 13,
                fontWeight: 600,
                cursor: (loading || demoLoading) ? "not-allowed" : "pointer",
                opacity: (loading || demoLoading) ? 0.7 : 1,
                fontFamily: "inherit",
                marginTop: 8,
              }}
            >
              {demoLoading ? "Loading demo..." : "Preview as Admin (Demo Only)"}
            </button>
            <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: "8px 0 0" }}>
              Explore the full app. Changes are not saved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

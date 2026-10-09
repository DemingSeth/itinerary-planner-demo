"use client";

import { useRouter } from "next/navigation";
import { DEMO_HOST_ID, getTour, getMembers, getAgendaDays, getPostTrip, getVendors } from "@/lib/demo-data";
import { useDemoState } from "@/lib/demo-store";
import TourDetailClient from "./TourDetailClient";

export default function TourDetailLoader({ id }: { id: string }) {
  const router = useRouter();
  const demo = useDemoState();
  if (!demo) return null;

  const { db, generation } = demo;
  const tour = getTour(db, id);

  if (!tour) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b", fontSize: 14 }}>
        <p style={{ margin: "0 0 14px" }}>This tour is not available in the demo.</p>
        <button
          onClick={() => router.push("/dashboard")}
          style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "7px 13px", fontSize: 12, color: "#64748b", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  // The detail view keeps local copies of these rows, so it reads them once on
  // mount and remounts when the demo is reset.
  return (
    <TourDetailClient
      key={`${id}:${generation}`}
      tour={tour}
      initialMembers={getMembers(db, id)}
      initialDays={getAgendaDays(db, id)}
      initialPostTrip={getPostTrip(db, id)}
      vendors={getVendors(db)}
      currentUserId={DEMO_HOST_ID}
    />
  );
}

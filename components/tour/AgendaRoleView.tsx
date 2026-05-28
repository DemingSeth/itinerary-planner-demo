"use client";

import { useState } from "react";
import TypeDot from "@/components/shared/TypeDot";
import { BRAND, ROLES, DEFAULT_VISIBILITY, getMapUrl, TRAVEL_METHODS, getRoleLabel } from "@/lib/helpers";
import { createClient } from "@/lib/supabase/client";
import { isDemoMode } from "@/lib/demoMode";
import type { AgendaDayWithItems, Role, FeedbackSentiment } from "@/lib/types";

interface Props {
  tourName: string;
  tourDestination?: string | null;
  tourDates?: string | null;
  tourType?: string | null;
  tourId?: string;
  days: AgendaDayWithItems[];
  role: Role;
  onClose?: () => void;
  embedded?: boolean;
  allowFeedback?: boolean;
}

export default function AgendaRoleView({ tourName, tourDestination, tourDates, tourType, tourId, days, role, onClose, embedded, allowFeedback }: Props) {
  const vis = DEFAULT_VISIBILITY[role] as Record<string, boolean>;
  const roleInfo = ROLES[role];
  const roleLabel = getRoleLabel(role, tourType);

  const [feedbackOpen, setFeedbackOpen] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [fbSentiment, setFbSentiment] = useState("😊");
  const [fbText, setFbText] = useState("");

  async function submitFeedback(itemId: string) {
    if (tourId && !isDemoMode()) {
      const supabase = createClient();
      await supabase.from("agenda_feedback").insert({
        item_id: itemId,
        tour_id: tourId,
        role,
        sentiment: fbSentiment as FeedbackSentiment,
        text: fbText || null,
      });
    }
    setSubmitted(prev => [...prev, itemId]);
    setFeedbackOpen(null);
    setFbText("");
    setFbSentiment("😊");
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      {embedded && (
        <div style={{ marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ background: roleInfo.bg, color: roleInfo.color, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
              Previewing: {roleLabel}
            </div>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>This is what {roleLabel.toLowerCase()}s see on the shared view.</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: "#f1f5f9", border: "none", borderRadius: 7, padding: "5px 12px", fontSize: 11, fontWeight: 600, color: "#64748b", cursor: "pointer", fontFamily: "inherit" }}
          >
            Close Preview
          </button>
        </div>
      )}

      <div style={{ background: BRAND.navy, borderRadius: 12, padding: "20px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontWeight: 800, fontSize: 13, color: "#FFFFFF", lineHeight: 1 }}>AI</span>
              <span style={{ display: "inline-block", width: 12, height: 2, background: "#FF6B6B", flexShrink: 0 }} />
            </div>
            <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 12, color: "#fff", letterSpacing: 0.3 }}>Itinerary Planner</span>
          </div>
          <div style={{ background: roleInfo.bg, color: roleInfo.color, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
            {roleLabel}
          </div>
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>
          {tourName}
        </h1>
        {(tourDestination || tourDates) && (
          <div style={{ color: "#ffa8a8", fontSize: 13 }}>
            {[tourDestination, tourDates].filter(Boolean).join(" · ")}
          </div>
        )}
      </div>

      {days.length === 0 && (
        <div style={{ background: "#f8fafc", border: "2px dashed #e2e8f0", borderRadius: 12, padding: "40px 20px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
          No agenda days have been added yet.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {days.map(day => (
          <div key={day.id} style={{ background: "#fff", border: "1.5px solid #e8eef4", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
            <div style={{ background: BRAND.navy, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", color: "#fff", fontWeight: 700, fontSize: 15 }}>Day {day.day_number}</span>
              <span style={{ color: "#ffa8a8", fontSize: 13 }}>{day.date}</span>
              <span style={{ color: "rgba(255,255,255,.4)", fontSize: 11 }}>{day.agenda_items.length} item{day.agenda_items.length !== 1 ? "s" : ""}</span>
            </div>
            <div>
              {day.agenda_items.length === 0 && (
                <div style={{ color: "#cbd5e1", fontSize: 12, padding: "14px 16px", textAlign: "center" }}>No items</div>
              )}
              {day.agenda_items.map((item, idx) => (
                <div key={item.id} style={{ padding: "12px 16px", borderTop: idx > 0 ? "1px solid #f1f5f9" : undefined }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    {item.time && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", minWidth: 52, paddingTop: 4, flexShrink: 0 }}>{item.time}</span>
                    )}
                    <TypeDot type={item.type} size={24} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: BRAND.navy }}>{item.title}</span>
                        {item.travel_method && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", background: "#f3f4f6", borderRadius: 4, padding: "1px 6px" }}>
                            {TRAVEL_METHODS.find(m => m.value === item.travel_method)?.label ?? item.travel_method}
                          </span>
                        )}
                        {item.type === "food" && item.meal_pay_type && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: BRAND.teal, background: "#f0fdfa", borderRadius: 4, padding: "1px 6px" }}>
                            {item.meal_pay_type === "group" ? "Group Meal" : item.stipend_amount ? `Stipend $${item.stipend_amount}` : "Stipend"}
                          </span>
                        )}
                      </div>

                      {vis.detail && item.detail && (
                        <div style={{ fontSize: 12, color: "#475569", marginTop: 3 }}>{item.detail}</div>
                      )}

                      {item.public_note && (
                        <div style={{ fontSize: 12, color: "#1d4ed8", background: "#eff6ff", borderRadius: 6, padding: "5px 10px", marginTop: 6 }}>
                          {item.public_note}
                        </div>
                      )}

                      {vis.address && item.address && (
                        <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                          {item.address}
                          {vis.mapLink && getMapUrl(item.map_link, item.address) && (
                            <a
                              href={getMapUrl(item.map_link, item.address)!}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ marginLeft: 8, fontSize: 11, color: BRAND.teal, textDecoration: "none", fontWeight: 600 }}
                            >
                              Map
                            </a>
                          )}
                        </div>
                      )}

                      {item.website && (
                        <div style={{ fontSize: 12, marginTop: 3 }}>
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: BRAND.teal, textDecoration: "none", fontWeight: 600 }}
                          >
                            Website
                          </a>
                        </div>
                      )}

                      {vis.contactName && item.contact_name && (
                        <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                          {item.contact_name}
                          {vis.contactPhone && item.contact_phone && ` · ${item.contact_phone}`}
                          {vis.contactEmail && item.contact_email && ` · ${item.contact_email}`}
                        </div>
                      )}

                      {vis.cost && item.cost > 0 && (
                        <div style={{ fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontWeight: 700, color: "#475569" }}>
                            ${item.cost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                          {vis.costPaid && (
                            <span style={{ color: item.cost_paid ? "#059669" : "#dc2626", fontSize: 11, fontWeight: 700 }}>
                              {item.cost_paid ? "PAID" : "UNPAID"}
                            </span>
                          )}
                        </div>
                      )}

                      {vis.driverNote && item.driver_note && (
                        <div style={{ fontSize: 12, color: "#92400e", background: "#fef3c7", borderRadius: 6, padding: "5px 10px", marginTop: 6 }}>
                          Driver: {item.driver_note}
                        </div>
                      )}

                      {vis.internalNote && item.internal_note && (
                        <div style={{ fontSize: 12, color: "#5b21b6", background: "#f5f3ff", borderRadius: 6, padding: "5px 10px", marginTop: 6 }}>
                          Note: {item.internal_note}
                        </div>
                      )}
                    </div>
                  </div>

                  {allowFeedback && (
                    submitted.includes(item.id) ? (
                      <div style={{ marginTop: 8, paddingLeft: 34, fontSize: 11, color: "#059669", fontWeight: 600 }}>
                        ✓ Feedback submitted
                      </div>
                    ) : feedbackOpen === item.id ? (
                      <div style={{ marginTop: 10, paddingLeft: 34 }}>
                        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                          {[{ v: "😊", l: "Good" }, { v: "😐", l: "OK" }, { v: "😞", l: "Poor" }].map(opt => (
                            <button key={opt.v} onClick={() => setFbSentiment(opt.v)}
                              style={{ flex: 1, padding: "6px 4px", borderRadius: 8, border: `2px solid ${fbSentiment === opt.v ? "#0369a1" : "#e2e8f0"}`, background: fbSentiment === opt.v ? "#eff6ff" : "#fff", cursor: "pointer", fontSize: 22, lineHeight: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                              {opt.v}
                              <span style={{ fontSize: 9, color: fbSentiment === opt.v ? "#0369a1" : "#94a3b8", fontWeight: 600, fontFamily: "inherit" }}>{opt.l}</span>
                            </button>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <input value={fbText} onChange={e => setFbText(e.target.value)}
                            placeholder="Comment (optional)..."
                            style={{ flex: 1, border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontFamily: "inherit", color: "#1e293b", background: "#fff", outline: "none" }} />
                          <button onClick={() => submitFeedback(item.id)}
                            style={{ background: BRAND.navy, color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                            Submit
                          </button>
                          <button onClick={() => setFeedbackOpen(null)}
                            style={{ background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: 6, paddingLeft: 34 }}>
                        <button onClick={() => { setFeedbackOpen(item.id); setFbSentiment("😊"); setFbText(""); }}
                          style={{ fontSize: 11, color: "#94a3b8", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, display: "flex", alignItems: "center", gap: 4 }}>
                          <span>💬</span> Rate this stop
                        </button>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 28, paddingBottom: 20, fontSize: 11, color: "#94a3b8" }}>
        Built by{" "}
        <a href="https://aileverageautomation.com" target="_blank" rel="noopener noreferrer" style={{ color: "#94a3b8", textDecoration: "underline" }}>
          AI Leverage Automation
        </a>
      </div>
    </div>
  );
}

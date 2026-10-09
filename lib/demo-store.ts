// In-browser demo store. Starts from the bundled JSON and keeps every demo
// edit in sessionStorage, so changes survive navigation within a visit and
// disappear when the tab closes. Nothing is ever shared between visitors.

import { useSyncExternalStore } from "react";
import { BASE_DB, type DemoDb, type TableName, type RowOf } from "@/lib/demo-data";

const STORAGE_KEY = "planner_demo_db_v1";

export interface DemoState {
  db: DemoDb;
  // Bumped on reset so views holding local copies of rows can remount.
  generation: number;
}

let state: DemoState = { db: BASE_DB, generation: 0 };
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) state = { db: { ...BASE_DB, ...JSON.parse(raw) }, generation: 0 };
  } catch {
    // Storage unavailable or corrupt: fall back to the seed data.
  }
}

function emit() {
  listeners.forEach(l => l());
}

function commit(db: DemoDb) {
  state = { ...state, db };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // Storage full or blocked: edits still apply for this page view.
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function getSnapshot(): DemoState {
  ensureLoaded();
  return state;
}

function getServerSnapshot(): DemoState | null {
  return null;
}

// Null during server render and hydration, so callers render a placeholder
// instead of seed data that could flash before session edits apply.
export function useDemoState(): DemoState | null {
  return useSyncExternalStore<DemoState | null>(subscribe, getSnapshot, getServerSnapshot);
}

export function useDemoDb(): DemoDb | null {
  return useDemoState()?.db ?? null;
}

export function getGeneration(): number {
  return state.generation;
}

export function resetDemo() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
  loaded = true;
  state = { db: BASE_DB, generation: state.generation + 1 };
  emit();
}

// ─── Writes ───────────────────────────────────────────────────────────────────

const now = () => new Date().toISOString();

// Column defaults from the original schema, applied to inserted rows.
const DEFAULTS: Record<TableName, () => Record<string, unknown>> = {
  tour_hosts: () => ({ phone: null, initials: null, company: "Itinerary Planner", created_at: now() }),
  tours: () => ({
    contact_name: null, contact_email: null, contact_phone: null,
    planning_tour_host: null, traveling_tour_host: null,
    destination: null, alt_destination: null, dates: null, start_date: null, end_date: null,
    date_flexible: false, status: "bid", transport_type: "flight", bus_capacity: 55, company_pct: 12,
    room_config: { boysPerRoom: 4, girlsPerRoom: 4 },
    student_count: 0, boys_count: 0, girls_count: 0, activities: [], notes: null,
    access_codes: { coordinator: "", teacher: "", driver: "", student: "" },
    tour_type: null, created_at: now(), updated_at: now(),
  }),
  agenda_days: () => ({ collapsed: false, sort_order: 0 }),
  agenda_items: () => ({
    sort_order: 0, time: null, type: "activity", detail: null, public_note: null,
    address: null, map_link: null, website: null, travel_method: null,
    contact_name: null, contact_phone: null, contact_email: null,
    cost: 0, cost_paid: false, driver_note: null, internal_note: null,
    meal_pay_type: null, stipend_amount: null, item_visibility: null, created_at: now(),
  }),
  agenda_feedback: () => ({ sentiment: "😐", text: null, submitted_at: now() }),
  tour_members: () => ({ gender: null, waiver: false, notes: null, sort_order: 0, attendance_status: "pending" }),
  vendors: () => ({ category: null, rating: 4, flag: false, notes: null, created_by: null, created_at: now() }),
  post_trip: () => ({
    notes: null, school_feedback: null, what_worked: null, what_to_improve: null,
    do_next_time: null, do_not_repeat: null, completed: false, updated_at: now(),
  }),
};

type Insert<T extends TableName> = Partial<RowOf<T>>;

export function insertRows<T extends TableName>(table: T, rows: Insert<T>[]): RowOf<T>[] {
  ensureLoaded();
  const created = rows.map(r => ({ ...DEFAULTS[table](), ...r, id: r.id ?? crypto.randomUUID() })) as unknown as RowOf<T>[];
  commit({ ...state.db, [table]: [...state.db[table], ...created] });
  return created;
}

export function insertRow<T extends TableName>(table: T, row: Insert<T>): RowOf<T> {
  return insertRows(table, [row])[0];
}

export function updateRow<T extends TableName>(table: T, id: string, patch: Partial<RowOf<T>>) {
  ensureLoaded();
  const rows = state.db[table] as RowOf<T>[];
  commit({ ...state.db, [table]: rows.map(r => (r.id === id ? { ...r, ...patch } : r)) });
}

// Deletes a row and its dependents, matching the schema's ON DELETE CASCADE.
export function deleteRow(table: TableName, id: string) {
  ensureLoaded();
  const db = { ...state.db, [table]: (state.db[table] as { id: string }[]).filter(r => r.id !== id) } as DemoDb;
  const tourIds = new Set(table === "tours" ? [id] : []);
  const dayIds = new Set(table === "agenda_days" ? [id] : db.agenda_days.filter(d => tourIds.has(d.tour_id)).map(d => d.id));
  const itemIds = new Set(
    table === "agenda_items"
      ? [id]
      : db.agenda_items.filter(i => dayIds.has(i.day_id) || tourIds.has(i.tour_id)).map(i => i.id)
  );

  commit({
    ...db,
    agenda_days: db.agenda_days.filter(d => !dayIds.has(d.id)),
    agenda_items: db.agenda_items.filter(i => !itemIds.has(i.id)),
    agenda_feedback: db.agenda_feedback.filter(f => !itemIds.has(f.item_id) && !tourIds.has(f.tour_id)),
    tour_members: db.tour_members.filter(m => !tourIds.has(m.tour_id)),
    post_trip: db.post_trip.filter(p => !tourIds.has(p.tour_id)),
  });
}

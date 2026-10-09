// Static demo data layer. The bundled JSON in data/demo/ is the seed; every
// query below mirrors a select the app used to run against the database,
// including the nested shapes components expect.

import tourHostsJson from "@/data/demo/tour_hosts.json";
import toursJson from "@/data/demo/tours.json";
import tourMembersJson from "@/data/demo/tour_members.json";
import agendaDaysJson from "@/data/demo/agenda_days.json";
import agendaItemsJson from "@/data/demo/agenda_items.json";
import agendaFeedbackJson from "@/data/demo/agenda_feedback.json";
import postTripJson from "@/data/demo/post_trip.json";
import vendorsJson from "@/data/demo/vendors.json";
import type {
  TourHostRow, TourRow, TourMemberRow, AgendaDayRow, AgendaItemRow,
  AgendaFeedbackRow, PostTripRow, VendorRow, AgendaDayWithItems,
} from "@/lib/types";

export interface DemoDb {
  tour_hosts: TourHostRow[];
  tours: TourRow[];
  tour_members: TourMemberRow[];
  agenda_days: AgendaDayRow[];
  agenda_items: AgendaItemRow[];
  agenda_feedback: AgendaFeedbackRow[];
  post_trip: PostTripRow[];
  vendors: VendorRow[];
}

export type TableName = keyof DemoDb;
export type RowOf<T extends TableName> = DemoDb[T][number];

// JSON imports widen string unions to string, so they are cast to the row types.
export const BASE_DB: DemoDb = {
  tour_hosts: tourHostsJson as TourHostRow[],
  tours: toursJson as unknown as TourRow[],
  tour_members: tourMembersJson as unknown as TourMemberRow[],
  agenda_days: agendaDaysJson as AgendaDayRow[],
  agenda_items: agendaItemsJson as unknown as AgendaItemRow[],
  agenda_feedback: agendaFeedbackJson as unknown as AgendaFeedbackRow[],
  post_trip: postTripJson as PostTripRow[],
  vendors: vendorsJson as unknown as VendorRow[],
};

// The demo has exactly one host and no authentication.
export const DEMO_HOST_ID = "66e70f80-b314-42f4-8233-e49e4abe4f05";

export type TourListItem = TourRow & {
  tour_hosts: Pick<TourHostRow, "id" | "name" | "initials"> | null;
  tour_members: Pick<TourMemberRow, "id" | "type" | "waiver" | "attendance_status">[];
};

export type TourDetail = TourRow & {
  tour_hosts: Pick<TourHostRow, "id" | "name" | "initials" | "phone" | "email"> | null;
};

const bySortOrder = <T extends { sort_order: number }>(a: T, b: T) => a.sort_order - b.sort_order;

export function getHost(db: DemoDb, id: string = DEMO_HOST_ID): TourHostRow | null {
  return db.tour_hosts.find(h => h.id === id) ?? null;
}

// tours + tour_hosts(id, name, initials) + tour_members(id, type, waiver, attendance_status), created_at desc
export function getTours(db: DemoDb): TourListItem[] {
  return [...db.tours]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map(t => {
      const host = getHost(db, t.tour_host_id);
      return {
        ...t,
        tour_hosts: host ? { id: host.id, name: host.name, initials: host.initials } : null,
        tour_members: db.tour_members
          .filter(m => m.tour_id === t.id)
          .map(m => ({ id: m.id, type: m.type, waiver: m.waiver, attendance_status: m.attendance_status })),
      };
    });
}

export function getTourRow(db: DemoDb, id: string): TourRow | null {
  return db.tours.find(t => t.id === id) ?? null;
}

// tours + tour_hosts(id, name, initials, phone, email), single
export function getTour(db: DemoDb, id: string): TourDetail | null {
  const tour = getTourRow(db, id);
  if (!tour) return null;
  const host = getHost(db, tour.tour_host_id);
  return {
    ...tour,
    tour_hosts: host ? { id: host.id, name: host.name, initials: host.initials, phone: host.phone, email: host.email } : null,
  };
}

// tour_members by tour_id, sort_order
export function getMembers(db: DemoDb, tourId: string): TourMemberRow[] {
  return db.tour_members.filter(m => m.tour_id === tourId).sort(bySortOrder);
}

// agenda_days + agenda_items(*, agenda_feedback(*)) by tour_id, days and items by sort_order
export function getAgendaDays(db: DemoDb, tourId: string): AgendaDayWithItems[] {
  return db.agenda_days
    .filter(d => d.tour_id === tourId)
    .sort(bySortOrder)
    .map(day => ({
      ...day,
      agenda_items: db.agenda_items
        .filter(i => i.day_id === day.id)
        .sort(bySortOrder)
        .map(item => ({
          ...item,
          agenda_feedback: db.agenda_feedback
            .filter(f => f.item_id === item.id)
            .sort((a, b) => a.submitted_at.localeCompare(b.submitted_at)),
        })),
    }));
}

// post_trip by tour_id, maybeSingle
export function getPostTrip(db: DemoDb, tourId: string): PostTripRow | null {
  return db.post_trip.find(p => p.tour_id === tourId) ?? null;
}

// vendors, ordered by name
export function getVendors(db: DemoDb): VendorRow[] {
  return [...db.vendors].sort((a, b) => a.name.localeCompare(b.name));
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PipelineView from "@/components/pipeline/PipelineView";
import NewTourModal from "@/components/pipeline/NewTourModal";
import { DEMO_HOST_ID, getHost, getTours, getTourRow, getAgendaDays } from "@/lib/demo-data";
import { useDemoDb, insertRow, insertRows } from "@/lib/demo-store";
import type { TourStatus, TransportType, TourType } from "@/lib/types";

export default function PipelineClient() {
  const router = useRouter();
  const db = useDemoDb();
  const [showNewTour, setShowNewTour] = useState(false);
  const [duplicating, setDuplicating] = useState<string | null>(null);

  if (!db) return null;

  const tours = getTours(db);
  const currentHostId = DEMO_HOST_ID;
  const currentHostName = getHost(db)?.name ?? "Demo Host";

  async function handleNewTour(fields: {
    name: string; school: string; destination: string;
    dates: string; status: string; transport_type: string; tour_type: string;
  }) {
    const tour = insertRow("tours", {
      tour_host_id: currentHostId,
      name: fields.name,
      school: fields.school,
      destination: fields.destination,
      dates: fields.dates,
      status: fields.status as TourStatus,
      transport_type: fields.transport_type as TransportType,
      tour_type: fields.tour_type as TourType,
      access_codes: { coordinator: "", teacher: "", driver: "", student: "" },
    });
    setShowNewTour(false);
    router.push(`/tour/${tour.id}`);
  }

  function handleDuplicate(tourId: string) {
    if (!db) return;
    const source = getTourRow(db, tourId);
    if (!source) return;
    setDuplicating(tourId);

    // Create new tour shell
    const newTour = insertRow("tours", {
      tour_host_id: currentHostId,
      name: `${source.name} (copy)`,
      school: source.school,
      contact_name: source.contact_name,
      contact_email: source.contact_email,
      contact_phone: source.contact_phone,
      planning_tour_host: source.planning_tour_host,
      traveling_tour_host: source.traveling_tour_host,
      destination: source.destination,
      alt_destination: source.alt_destination,
      dates: source.dates,
      date_flexible: source.date_flexible,
      status: "bid",
      transport_type: source.transport_type,
      bus_capacity: source.bus_capacity,
      company_pct: source.company_pct,
      room_config: source.room_config,
      activities: source.activities,
      notes: source.notes,
      access_codes: { coordinator: "", teacher: "", driver: "", student: "" },
    });

    // Copy agenda days + items
    for (const day of getAgendaDays(db, tourId)) {
      const newDay = insertRow("agenda_days", {
        tour_id: newTour.id,
        day_number: day.day_number,
        date: day.date,
        collapsed: day.collapsed,
        sort_order: day.sort_order,
      });
      if (day.agenda_items.length) {
        insertRows("agenda_items", day.agenda_items.map(item => ({
          day_id: newDay.id,
          tour_id: newTour.id,
          sort_order: item.sort_order,
          time: item.time,
          type: item.type,
          title: item.title,
          detail: item.detail,
          public_note: item.public_note,
          address: item.address,
          map_link: item.map_link,
          website: item.website,
          travel_method: item.travel_method,
          contact_name: item.contact_name,
          contact_phone: item.contact_phone,
          contact_email: item.contact_email,
          cost: item.cost,
          cost_paid: false,
          driver_note: item.driver_note,
          internal_note: item.internal_note,
          meal_pay_type: item.meal_pay_type,
          stipend_amount: item.stipend_amount,
          item_visibility: item.item_visibility,
        })));
      }
    }

    setDuplicating(null);
    router.push(`/tour/${newTour.id}`);
  }

  return (
    <>
      <PipelineView
        tours={tours}
        currentHostId={currentHostId}
        currentHostName={currentHostName}
        duplicatingId={duplicating}
        onSelectTour={(id) => router.push(`/tour/${id}`)}
        onNewTour={() => setShowNewTour(true)}
        onDuplicate={handleDuplicate}
      />
      {showNewTour && (
        <NewTourModal
          onClose={() => setShowNewTour(false)}
          onCreate={handleNewTour}
        />
      )}
    </>
  );
}

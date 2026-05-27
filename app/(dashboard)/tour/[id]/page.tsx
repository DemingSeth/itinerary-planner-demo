import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TourDetailClient from "./TourDetailClient";

const DEMO_USER_ID = "66e70f80-b314-42f4-8233-e49e4abe4f05";

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userId = user?.id ?? DEMO_USER_ID;

  const [{ data: tour }, { data: members }, { data: days }, { data: postTrip }, { data: vendors }] = await Promise.all([
    supabase
      .from("tours")
      .select("*, tour_hosts(id, name, initials, phone, email)")
      .eq("id", id)
      .single(),
    supabase
      .from("tour_members")
      .select("*")
      .eq("tour_id", id)
      .order("sort_order"),
    supabase
      .from("agenda_days")
      .select("*, agenda_items(*, agenda_feedback(*))")
      .eq("tour_id", id)
      .order("sort_order"),
    supabase
      .from("post_trip")
      .select("*")
      .eq("tour_id", id)
      .maybeSingle(),
    supabase
      .from("vendors")
      .select("*")
      .order("name"),
  ]);

  if (!tour) notFound();

  return (
    <TourDetailClient
      tour={tour}
      initialMembers={members ?? []}
      initialDays={days ?? []}
      initialPostTrip={postTrip ?? null}
      vendors={vendors ?? []}
      currentUserId={userId}
    />
  );
}

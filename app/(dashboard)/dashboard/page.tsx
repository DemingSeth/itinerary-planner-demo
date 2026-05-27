import { createClient } from "@/lib/supabase/server";
import PipelineClient from "./PipelineClient";

const DEMO_USER_ID = "66e70f80-b314-42f4-8233-e49e4abe4f05";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userId = user?.id ?? DEMO_USER_ID;

  const [{ data: tours }, { data: tourHost }] = await Promise.all([
    supabase
      .from("tours")
      .select("*, tour_hosts(id, name, initials), tour_members(id, type, waiver)")
      .order("created_at", { ascending: false }),
    supabase
      .from("tour_hosts")
      .select("*")
      .eq("id", userId)
      .single(),
  ]);

  return (
    <PipelineClient
      initialTours={tours ?? []}
      currentHostId={userId}
      currentHostName={tourHost?.name ?? user?.email ?? "Demo Host"}
    />
  );
}

import TourDetailLoader from "./TourDetailLoader";

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TourDetailLoader id={id} />;
}

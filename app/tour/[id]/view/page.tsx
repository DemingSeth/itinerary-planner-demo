import PublicTourViewClient from "./PublicTourViewClient";

export default async function PublicTourViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PublicTourViewClient tourId={id} />;
}

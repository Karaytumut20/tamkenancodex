import { redirect } from "next/navigation";

export default async function LegacyEditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/admin/system-builder/${id}/edit`);
}

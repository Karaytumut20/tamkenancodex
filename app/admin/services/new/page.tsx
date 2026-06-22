import { redirect } from "next/navigation";

export default function LegacyNewServicePage() {
  redirect("/admin/system-builder/new");
}

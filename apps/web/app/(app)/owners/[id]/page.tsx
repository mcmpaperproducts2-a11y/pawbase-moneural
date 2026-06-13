import { redirect } from "next/navigation";

export default function OwnerDetailPage({ params }: { params: { id: string } }) {
  void params;
  redirect("/pets");
}

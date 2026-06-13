import { NextRequest, NextResponse } from "next/server";
import { updatePet } from "@/lib/owners-pets/store";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const formData = await request.formData();
  const file = formData.get("photo") as File | null;
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return NextResponse.json({ error: "Only JPEG, PNG, WebP allowed" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Max file size is 5MB" }, { status: 400 });
  const photo_url = `/pet-photo-placeholder-${params.id}.png`;
  updatePet(params.id, { photo_url });
  return NextResponse.json({ photo_url });
}

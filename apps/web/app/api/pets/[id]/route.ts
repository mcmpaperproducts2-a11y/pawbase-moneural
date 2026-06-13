import { NextRequest, NextResponse } from "next/server";
import { deletePet, getPet, updatePet } from "@/lib/owners-pets/store";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const pet = getPet(params.id);
  if (!pet) return NextResponse.json({ error: "Pet not found" }, { status: 404 });
  return NextResponse.json(pet);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const result = updatePet(params.id, await request.json().catch(() => ({})));
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.pet);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const result = deletePet(params.id);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.pet);
}

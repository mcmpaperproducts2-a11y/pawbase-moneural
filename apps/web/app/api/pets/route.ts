import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPet, deletePet, listPets, updatePet } from "@/lib/owners-pets/store";

const petSchema = z.object({
  owner_id: z.string().min(1),
  name: z.string().min(1).max(50),
  species: z.enum(["dog", "cat", "rabbit", "bird", "other"]),
  breed: z.string().optional(),
  color: z.string().optional(),
  gender: z.enum(["male", "female", "unknown"]).optional(),
  date_of_birth: z.string().optional(),
  weight_kg: z.coerce.number().positive().optional(),
  microchip_number: z.string().optional(),
  is_neutered: z.boolean().optional(),
  temperament: z.enum(["friendly", "anxious", "aggressive", "calm", "energetic", "shy"]).optional(),
  feeding_instructions: z.string().optional(),
  special_needs: z.string().optional(),
  photo_url: z.string().optional()
});

export async function GET(request: NextRequest) {
  const data = listPets({ q: request.nextUrl.searchParams.get("q") ?? "", owner_id: request.nextUrl.searchParams.get("owner_id") ?? undefined, species: request.nextUrl.searchParams.get("species") ?? undefined });
  return NextResponse.json({ data, records: data.map((pet) => ({ id: pet.id, title: pet.name, subtitle: `${pet.breed ?? pet.species} · ${pet.owner_name}`, status: pet.vaccination_alert ? "vaccine tracked" : "active", data: pet as any })) });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const data = body?.data ?? body;
  const parsed = petSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const result = createPet(parsed.data);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ data: result.pet, record: { id: result.pet.id, title: result.pet.name, subtitle: `${result.pet.breed ?? result.pet.species} · ${result.pet.owner_name}`, status: "active", data: result.pet as any } }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  if (!body.id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
  const result = updatePet(body.id, body.data ?? body);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ data: result.pet, record: { id: result.pet.id, title: result.pet.name, subtitle: `${result.pet.breed ?? result.pet.species} · ${result.pet.owner_name}`, status: "active", data: result.pet as any } });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const result = deletePet(body.id);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.pet);
}

import { NextRequest, NextResponse } from "next/server";
import { deleteOwner, getOwner, updateOwner } from "@/lib/owners-pets/store";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const owner = getOwner(params.id);
  if (!owner) return NextResponse.json({ error: "Owner not found" }, { status: 404 });
  return NextResponse.json(owner);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const result = updateOwner(params.id, await request.json().catch(() => ({})));
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.owner);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const result = deleteOwner(params.id);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json(result.owner);
}

import { NextRequest, NextResponse } from "next/server";
import { deleteVaccination } from "@/lib/owners-pets/store";

export async function DELETE(_request: NextRequest, { params }: { params: { vaccinationId: string } }) {
  deleteVaccination(params.vaccinationId);
  return NextResponse.json({ ok: true });
}

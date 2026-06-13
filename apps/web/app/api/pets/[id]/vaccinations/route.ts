import { NextRequest, NextResponse } from "next/server";
import { addVaccination, listVaccinations } from "@/lib/owners-pets/store";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ data: listVaccinations(params.id) });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json(addVaccination(params.id, await request.json().catch(() => ({}))), { status: 201 });
}

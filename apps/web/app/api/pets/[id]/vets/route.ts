import { NextRequest, NextResponse } from "next/server";
import { addVet, listVets } from "@/lib/owners-pets/store";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ data: listVets(params.id) });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json(addVet(params.id, await request.json().catch(() => ({}))), { status: 201 });
}

import { NextResponse } from "next/server";

export function POST() {
  return NextResponse.json({ payment: { id: `pay-${Date.now()}`, status: "captured" } }, { status: 201 });
}

import { NextResponse } from "next/server";

export function POST() {
  return NextResponse.json({ booking: { id: `portal-booking-${Date.now()}`, status: "requested" } }, { status: 201 });
}

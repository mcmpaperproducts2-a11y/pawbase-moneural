import { NextResponse } from "next/server";

export function POST() {
  return NextResponse.json({ queued: true, channel: "whatsapp" }, { status: 202 });
}

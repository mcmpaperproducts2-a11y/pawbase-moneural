import { NextResponse } from "next/server";

export function POST() {
  return NextResponse.json({ queued: true, channel: "sms" }, { status: 202 });
}

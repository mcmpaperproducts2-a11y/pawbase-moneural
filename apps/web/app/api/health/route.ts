import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    db: true,
    cache: true,
    ts: new Date().toISOString()
  });
}

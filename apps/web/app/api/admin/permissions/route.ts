import { NextResponse } from "next/server";
import { moduleDefinitions } from "@/lib/modules/definitions";

export function GET() {
  return NextResponse.json({
    role: "super_admin",
    matrix: moduleDefinitions.map((module) => ({
      module: module.id,
      actions: ["create", "read", "update", "delete", "manage"]
    }))
  });
}

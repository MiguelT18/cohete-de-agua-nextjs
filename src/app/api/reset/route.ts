import { NextResponse } from "next/server";
import { telemetryStore } from "@/lib/telemetry-store";
import { statusStore } from "@/lib/status-store";

export async function POST() {
  await telemetryStore.reset();
  statusStore.reset();
  return NextResponse.json({ ok: true });
}

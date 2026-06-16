import { NextResponse } from "next/server";
import { telemetryStore } from "@/lib/telemetry-store";
import { statusStore } from "@/lib/status-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const telemetry = telemetryStore.getSnapshot();
  const status = statusStore.getStatus();

  return NextResponse.json({
    telemetry: {
      sampleCount: telemetry.sampleCount,
      connected: telemetry.connected,
      lastUpdate: telemetry.lastUpdate,
      hasLatest: telemetry.latest !== null,
      historyLength: telemetry.history.length,
      latest: telemetry.latest,
    },
    status: status
      ? { ...status, _alive: true }
      : { _alive: false },
    now: Date.now(),
  });
}

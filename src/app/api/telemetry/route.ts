import { NextRequest, NextResponse } from "next/server";
import { telemetryStore } from "@/lib/telemetry-store";
import { TelemetryData } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    if (Array.isArray(payload)) {
      for (const item of payload) {
        await telemetryStore.addReading(item as TelemetryData);
      }
    } else {
      await telemetryStore.addReading(payload as TelemetryData);
    }

    const snap = await telemetryStore.getSnapshot();
    return NextResponse.json({ ok: true, sample: snap.sampleCount });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 400 });
  }
}

export async function GET() {
  const snapshot = await telemetryStore.getSnapshot();
  return NextResponse.json(snapshot);
}

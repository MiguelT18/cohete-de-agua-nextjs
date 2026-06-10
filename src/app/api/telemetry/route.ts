import { NextRequest, NextResponse } from "next/server";
import { telemetryStore } from "@/lib/telemetry-store";
import { TelemetryData } from "@/lib/types";

function processReading(data: TelemetryData) {
  telemetryStore.addReading(data);
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    if (Array.isArray(payload)) {
      for (const item of payload) {
        processReading(item as TelemetryData);
      }
    } else {
      processReading(payload as TelemetryData);
    }

    return NextResponse.json({ ok: true, sample: telemetryStore.getSnapshot().sampleCount });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { telemetryStore } from "@/lib/telemetry-store";
import { statusStore } from "@/lib/status-store";
import { flightStore } from "@/lib/flight-store";
import { setPendingReset } from "@/lib/wifi-store";

export async function POST() {
  const [snapshot, status] = await Promise.all([
    telemetryStore.getSnapshot(),
    statusStore.getStatus(),
  ]);

  if (snapshot?.history && snapshot.history.length > 0) {
    const maxAlt = Math.max(...snapshot.history.map((d) => d.alt));
    const maxVel = Math.max(...snapshot.history.map((d) => d.vel));
    const maxAcc = Math.max(...snapshot.history.map((d) => Math.abs(d.acc)));
    const duration = (status?.tiempoVuelo ?? snapshot.latest?.t ?? 0) / 1000;

    flightStore.add({
      timestamp: Date.now(),
      duration,
      maxAlt,
      maxVel,
      maxAcc,
      samples: snapshot.sampleCount,
    });
  }

  await Promise.all([
    telemetryStore.reset(),
    statusStore.reset(),
  ]);
  setPendingReset();
  return NextResponse.json({ ok: true });
}

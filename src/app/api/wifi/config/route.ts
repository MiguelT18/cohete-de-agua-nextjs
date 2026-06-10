import { NextRequest, NextResponse } from "next/server";
import { setPendingWifiConfig } from "@/lib/wifi-store";

export async function POST(request: NextRequest) {
  try {
    const { ssid, password } = await request.json();
    if (!ssid || typeof ssid !== "string" || ssid.length === 0) {
      return NextResponse.json({ ok: false, error: "SSID requerido" }, { status: 400 });
    }
    setPendingWifiConfig(ssid, password || "");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 400 });
  }
}

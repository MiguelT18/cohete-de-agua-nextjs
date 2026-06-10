import { NextResponse } from "next/server";
import { consumePendingWifiConfig } from "@/lib/wifi-store";

export async function GET() {
  const pending = consumePendingWifiConfig();
  return NextResponse.json(pending);
}

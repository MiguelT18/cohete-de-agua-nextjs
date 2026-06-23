import { NextRequest, NextResponse } from "next/server";
import { statusStore } from "@/lib/status-store";
import { EspStatus } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as EspStatus;
    await statusStore.update(payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 400 });
  }
}

export async function GET() {
  const status = await statusStore.getStatus();
  return NextResponse.json(status ?? { connected: false });
}

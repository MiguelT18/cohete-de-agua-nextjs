import { NextResponse } from "next/server";
import { flightStore } from "@/lib/flight-store";

export async function GET() {
  return NextResponse.json(flightStore.getAll());
}

import { telemetryStore } from "@/lib/telemetry-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const snapshot = await telemetryStore.getSnapshot();
  const initialMsg = `data: ${JSON.stringify({ type: "snapshot", ...snapshot })}\n\n`;

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(initialMsg));

      const unsubscribe = telemetryStore.subscribe(async () => {
        const s = await telemetryStore.getSnapshot();
        const m = `data: ${JSON.stringify({ type: "snapshot", ...s })}\n\n`;
        try {
          controller.enqueue(encoder.encode(m));
        } catch {
          unsubscribe();
        }
      });

      request.signal.addEventListener("abort", () => {
        unsubscribe();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

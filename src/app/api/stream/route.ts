import { telemetryStore } from "@/lib/telemetry-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const snapshot = telemetryStore.getSnapshot();
      const msg = `data: ${JSON.stringify({ type: "snapshot", ...snapshot })}\n\n`;
      controller.enqueue(encoder.encode(msg));

      const unsubscribe = telemetryStore.subscribe(() => {
        const s = telemetryStore.getSnapshot();
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

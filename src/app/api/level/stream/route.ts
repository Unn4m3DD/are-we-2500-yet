import { getLevelWatcher, type LevelChange } from "@/app/lib/level-watcher";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function formatSSE(event: string, data: unknown): string {
  return `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`;
}

export async function GET(request: Request) {
  const watcher = getLevelWatcher();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      // Send initial comment to open the stream
      controller.enqueue(encoder.encode(": connected\n\n"));

      const unsubscribe = watcher.subscribe((change: LevelChange) => {
        controller.enqueue(encoder.encode(formatSSE("level-change", change)));
      });

      // Keep-alive ping every 25s (some proxies time out idle streams)
      const pingId = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          // no-op if controller closed
        }
      }, 25_000);

      const abortHandler = () => {
        clearInterval(pingId);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // already closed
        }
      };

      // Close on client disconnect
      request.signal.addEventListener("abort", abortHandler);
    },
    cancel() {
      // If stream is canceled by consumer, nothing specific to do here.
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}



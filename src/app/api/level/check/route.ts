import { getLevelWatcher } from "@/app/lib/level-watcher";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const watcher = getLevelWatcher();
  await watcher.checkNow();
  return Response.json({ ok: true });
}



/*
  Server-side singleton that periodically checks chess.com ratings
  and notifies subscribers when a rating changes.
*/

type LevelChange = {
  username: string;
  previous: number;
  current: number;
  diff: number;
  timestamp: number;
};

type Subscriber = (change: LevelChange) => void;

type LevelsState = Record<string, number | undefined>;

const USERNAMES_TO_WATCH = ["bearkillerpt", "unn4m3ddd"] as const;

async function fetchUserTacticsRating(username: string): Promise<number | undefined> {
  const res = await fetch(
    `https://www.chess.com/callback/member/stats/${encodeURIComponent(username)}`,
    { cache: "no-cache" }
  );
  if (!res.ok) return undefined;
  const json = (await res.json()) as any;
  const tactics = Array.isArray(json?.stats)
    ? json.stats.find((s: any) => s?.key === "tactics")
    : undefined;
  const rating = tactics?.stats?.rating;
  return typeof rating === "number" ? rating : undefined;
}

class LevelWatcher {
  private intervalId: NodeJS.Timeout | null = null;
  private keepAliveCounterId: NodeJS.Timeout | null = null;
  private readonly subscribers: Set<Subscriber> = new Set();
  private readonly levels: LevelsState = {};

  constructor() {
    // Start polling shortly after construction to allow environment boot.
    this.start();
  }

  subscribe(subscriber: Subscriber): () => void {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  private emit(change: LevelChange) {
    for (const subscriber of this.subscribers) {
      try {
        subscriber(change);
      } catch {
        // ignore subscriber errors
      }
    }
  }

  async checkNow(): Promise<void> {
    const timestamp = Date.now();
    for (const username of USERNAMES_TO_WATCH) {
      try {
        const current = await fetchUserTacticsRating(username);
        if (typeof current !== "number") continue;
        const previous = this.levels[username];
        // Save the latest regardless, so subsequent comparisons work
        this.levels[username] = current;
        if (typeof previous === "number" && previous !== current) {
          const diff = current - previous;
          this.emit({ username, previous, current, diff, timestamp });
        }
      } catch {
        // ignore transient errors
      }
    }
  }

  private start() {
    if (this.intervalId) return; // already started
    // Initial delayed check (avoid emitting on first-ever fetch)
    // We will perform two quick checks to establish a baseline without emitting.
    void this.bootstrapBaseline();
    // Then poll every 5 minutes
    this.intervalId = setInterval(() => {
      void this.checkNow();
    }, 5 * 60 * 1000);
  }

  private async bootstrapBaseline() {
    // Perform two spaced checks to populate baseline without emitting.
    for (const username of USERNAMES_TO_WATCH) {
      try {
        const current = await fetchUserTacticsRating(username);
        if (typeof current === "number") {
          this.levels[username] = current;
        }
      } catch {
        // ignore
      }
    }
    // Second baseline after a short delay to smooth over transient values
    await new Promise((r) => setTimeout(r, 2000));
    for (const username of USERNAMES_TO_WATCH) {
      try {
        const current = await fetchUserTacticsRating(username);
        if (typeof current === "number") {
          this.levels[username] = current;
        }
      } catch {
        // ignore
      }
    }
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __levelWatcher__: LevelWatcher | undefined;
}

export function getLevelWatcher(): LevelWatcher {
  if (!globalThis.__levelWatcher__) {
    globalThis.__levelWatcher__ = new LevelWatcher();
  }
  return globalThis.__levelWatcher__;
}

export type { LevelChange };



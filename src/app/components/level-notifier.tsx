"use client";

import { useEffect, useRef } from "react";

function ensureNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "default") {
    void Notification.requestPermission();
  }
}

function showNativeNotification(title: string, options?: NotificationOptions) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission === "granted") {
    try {
      new Notification(title, options);
    } catch {
      // ignore notification errors
    }
  }
}

export function LevelNotifier() {
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    ensureNotificationPermission();

    const es = new EventSource("/api/level/stream");
    esRef.current = es;

    const handler = (ev: MessageEvent) => {
      try {
        const change = JSON.parse(ev.data) as {
          username: string;
          previous: number;
          current: number;
          diff: number;
          timestamp: number;
        };
        const up = change.diff > 0;
        const emoji = up ? "📈" : "📉";
        const body = `${change.username} ${up ? "up" : "down"} ${Math.abs(
          change.diff
        )} → ${change.current}`;
        showNativeNotification(`Level changed ${emoji}`, {
          body,
          tag: `level-${change.username}`,
        });
      } catch {
        // ignore invalid payloads
      }
    };

    es.addEventListener("level-change", handler as unknown as EventListener);

    es.onerror = () => {
      // Let browser retry handling reconnects
    };

    return () => {
      es.removeEventListener("level-change", handler as unknown as EventListener);
      es.close();
      esRef.current = null;
    };
  }, []);

  return null;
}



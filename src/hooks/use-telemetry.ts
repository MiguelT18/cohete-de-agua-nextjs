"use client"

import { useCallback, useEffect, useRef, useState } from "react";

import { TelemetryData, TelemetrySnapshot } from "@/lib/types";

const SNAPSHOT_FIELDS = ["latest", "history", "sampleCount", "lastUpdate", "connected"] as const;

function isSnapshot(obj: unknown): obj is TelemetrySnapshot & { type?: string } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    SNAPSHOT_FIELDS.every((f) => f in (obj as Record<string, unknown>))
  );
}

interface UseTelemetryReturn {
  latest: TelemetryData | null;
  history: TelemetryData[];
  sampleCount: number;
  lastUpdate: number | null;
  connected: boolean;
}

export function useTelemetry(): UseTelemetryReturn {
  const [latest, setLatest] = useState<TelemetryData | null>(null);
  const [history, setHistory] = useState<TelemetryData[]>([]);
  const [sampleCount, setSampleCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    const es = new EventSource("/api/stream");

    es.onopen = () => {
      setConnected(true);
    };

    es.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === "snapshot" && isSnapshot(parsed)) {
          setLatest(parsed.latest);
          setHistory(parsed.history);
          setSampleCount(parsed.sampleCount);
          setLastUpdate(parsed.lastUpdate);
          setConnected(parsed.connected);
        }
      } catch {
        /* ignore */
      }
    };

    es.onerror = () => {
      es.close();
      setConnected(false);
      esRef.current = null;
      retryRef.current = setTimeout(connect, 1500);
    };

    esRef.current = es;
  }, []);

  useEffect(() => {
    const timer = setTimeout(connect, 500);
    return () => {
      clearTimeout(timer);
      esRef.current?.close();
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, [connect]);

  return { latest, history, sampleCount, lastUpdate, connected };
}

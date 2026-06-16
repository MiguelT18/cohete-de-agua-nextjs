"use client"

import { useEffect, useRef, useState } from "react";

import { TelemetryData } from "@/lib/types";

export interface TelemetrySnapshot {
  latest: TelemetryData | null;
  history: TelemetryData[];
  sampleCount: number;
  lastUpdate: number | null;
  connected: boolean;
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
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    async function poll() {
      try {
        const res = await fetch("/api/telemetry");
        if (!mountedRef.current) return;
        if (res.ok) {
          const snapshot: TelemetrySnapshot = await res.json();
          setLatest(snapshot.latest ?? null);
          setHistory(snapshot.history ?? []);
          setSampleCount(snapshot.sampleCount ?? 0);
          setLastUpdate(snapshot.lastUpdate ?? null);
          setConnected(snapshot.connected ?? false);
        } else {
          if (mountedRef.current) setConnected(false);
        }
      } catch {
        if (mountedRef.current) setConnected(false);
      }
    }

    poll();
    const interval = setInterval(poll, 1000);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  return { latest, history, sampleCount, lastUpdate, connected };
}

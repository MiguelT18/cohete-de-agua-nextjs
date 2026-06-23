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

const CONNECTED_TIMEOUT = 30000;
const MAX_FAILS = 3;

export function useTelemetry(): UseTelemetryReturn {
  const [latest, setLatest] = useState<TelemetryData | null>(null);
  const [history, setHistory] = useState<TelemetryData[]>([]);
  const [sampleCount, setSampleCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);
  const mountedRef = useRef(true);
  const lastDataRef = useRef<number | null>(null);
  const failCountRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;

    async function poll() {
      try {
        const res = await fetch("/api/telemetry");
        if (!mountedRef.current) return;
        if (res.ok) {
          const snapshot: TelemetrySnapshot = await res.json();
          if (snapshot.sampleCount > 0 || snapshot.latest) {
            lastDataRef.current = Date.now();
            failCountRef.current = 0;
          }
          setLatest(snapshot.latest ?? null);
          setHistory(snapshot.history ?? []);
          setSampleCount(snapshot.sampleCount ?? 0);
          setLastUpdate(snapshot.lastUpdate ?? null);
        } else {
          failCountRef.current++;
        }
      } catch {
        failCountRef.current++;
      }

      if (!mountedRef.current) return;

      const ago = lastDataRef.current ? Date.now() - lastDataRef.current : Infinity;
      const hasRecentData = ago < CONNECTED_TIMEOUT;
      const hasEverHadData = lastDataRef.current !== null;
      const tooManyFails = failCountRef.current >= MAX_FAILS;

      setConnected(hasEverHadData && hasRecentData && !tooManyFails);
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

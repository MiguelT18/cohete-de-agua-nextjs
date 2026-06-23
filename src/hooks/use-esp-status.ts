"use client"

import { useEffect, useRef, useState } from "react";

import { EspStatus } from "@/lib/types";

const ALIVE_TIMEOUT = 30000;
const MAX_FAILS = 3;

export function useEspStatus() {
  const [status, setStatus] = useState<EspStatus | null>(null);
  const [alive, setAlive] = useState(false);
  const mountedRef = useRef(true);
  const lastDataRef = useRef<number | null>(null);
  const failCountRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;

    async function poll() {
      try {
        const res = await fetch("/api/status");
        if (!mountedRef.current) return;
        if (res.ok) {
          const data = await res.json();
          if (data && "wifi" in data) {
            setStatus(data as EspStatus);
            lastDataRef.current = Date.now();
            failCountRef.current = 0;
          } else {
            failCountRef.current++;
          }
        } else {
          failCountRef.current++;
        }
      } catch {
        failCountRef.current++;
      }

      if (!mountedRef.current) return;

      const ago = lastDataRef.current ? Date.now() - lastDataRef.current : Infinity;
      setAlive(
        lastDataRef.current !== null &&
        ago < ALIVE_TIMEOUT &&
        failCountRef.current < MAX_FAILS
      );
    }

    poll();
    const interval = setInterval(poll, 5000);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  return { status, alive };
}

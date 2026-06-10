"use client"

import { useEffect, useRef, useState } from "react";

import { EspStatus } from "@/lib/types";

export function useEspStatus() {
  const [status, setStatus] = useState<EspStatus | null>(null);
  const [alive, setAlive] = useState(false);
  const mountedRef = useRef(true);

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
            setAlive(true);
          } else {
            setAlive(false);
          }
        } else {
          setAlive(false);
        }
      } catch {
        if (mountedRef.current) setAlive(false);
      }
    }

    poll();
    const interval = setInterval(poll, 3000);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, []);

  return { status, alive };
}

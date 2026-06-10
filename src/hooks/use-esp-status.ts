"use client"

import { useEffect, useState } from "react";

import { EspStatus } from "@/lib/types";

export function useEspStatus() {
  const [status, setStatus] = useState<EspStatus | null>(null);

  useEffect(() => {
    let mounted = true;

    async function poll() {
      try {
        const res = await fetch("/api/status");
        if (res.ok) {
          const data = await res.json();
          if (mounted && data && "wifi" in data) {
            setStatus(data as EspStatus);
          }
        }
      } catch {
        /* ignore */
      }
    }

    poll();
    const interval = setInterval(poll, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return status;
}

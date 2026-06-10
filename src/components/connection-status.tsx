"use client"

import { Badge } from "@/components/ui/badge"

interface ConnectionStatusProps {
  connected: boolean
  lastUpdate: number | null
  sampleCount: number
}

export function ConnectionStatus({ connected, lastUpdate, sampleCount }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-4">
      <Badge
        variant={connected ? "success" : "destructive"}
        className="gap-1.5 px-3 py-1 text-xs font-medium uppercase tracking-wider"
      >
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            connected
              ? "bg-emerald-500 animate-pulse-dot shadow-[0_0_6px] shadow-emerald-500/50"
              : "bg-red-500"
          }`}
        />
        {connected ? "Conectado" : "Desconectado"}
      </Badge>
      <div className="hidden sm:flex sm:items-center sm:gap-4">
        <span className="text-xs text-muted-foreground/60">
          Muestras: <span className="font-mono font-medium text-foreground/80">{sampleCount}</span>
        </span>
        {lastUpdate && (
          <span className="text-xs text-muted-foreground/60">
            Última:{" "}
            <span className="font-mono font-medium text-foreground/80">
              {new Date(lastUpdate).toLocaleTimeString("es-ES")}
            </span>
          </span>
        )}
      </div>
    </div>
  )
}

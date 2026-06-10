"use client"

import { Badge } from "@/components/ui/badge"
import { useEspStatus } from "@/hooks/use-esp-status"

interface ConnectionStatusProps {
  connected: boolean
  lastUpdate: number | null
  sampleCount: number
}

function allOk(s: { wifi: boolean; sd: boolean; bmp1: boolean; aht1: boolean; mpu: boolean; bmp2: boolean; aht2: boolean }) {
  return s.wifi && s.sd && s.bmp1 && s.aht1 && s.mpu && s.bmp2 && s.aht2
}

export function ConnectionStatus({ connected, lastUpdate, sampleCount }: ConnectionStatusProps) {
  const { status, alive } = useEspStatus()

  const badgeVariant = !alive ? "destructive" : allOk(status!) ? "success" : "warning"
  const badgeLabel = !alive ? "Desconectado" : allOk(status!) ? "Conectado" : "Parcial"
  const dotColor = !alive
    ? "bg-red-500"
    : allOk(status!)
      ? "bg-emerald-500 animate-pulse-dot shadow-[0_0_6px] shadow-emerald-500/50"
      : "bg-amber-500"

  return (
    <div className="flex items-center gap-4">
      <Badge
        variant={badgeVariant}
        className="gap-1.5 px-3 py-1 text-xs font-medium uppercase tracking-wider"
      >
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotColor}`} />
        {badgeLabel}
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

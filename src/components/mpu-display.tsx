"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MPUDisplayProps {
  ax: number
  ay: number
  az: number
  gx: number
  gy: number
  gz: number
  className?: string
}

function AxisBar({ label, value, max = 20, color }: { label: string; value: number; max?: number; color: string }) {
  const pct = Math.min(Math.abs(value) / max, 1) * 100
  const isNegative = value < 0

  return (
    <div className="flex items-center gap-2">
      <span className="w-4 text-xs font-bold" style={{ color }}>{label}</span>
      <div className="relative flex h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "absolute top-0 h-full rounded-full transition-all duration-200",
            isNegative ? "left-1/2" : ""
          )}
          style={{
            [isNegative ? "right" : "left"]: "50%",
            width: `${pct}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <span className="w-16 text-right text-xs tabular-nums text-muted-foreground">
        {value.toFixed(value > -10 && value < 10 ? 2 : 1)}
      </span>
    </div>
  )
}

export function MPUDisplay({ ax, ay, az, gx, gy, gz, className }: MPUDisplayProps) {
  return (
    <Card className={cn("overflow-hidden border-border/50 shadow-sm", className)}>
      <CardHeader className="border-b border-border/30 bg-gradient-to-r from-primary/[0.02] to-transparent pb-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          MPU6050
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Acelerómetro (m/s²)
            </span>
            <AxisBar label="X" value={ax} color="#ef4444" />
            <AxisBar label="Y" value={ay} color="#22c55e" />
            <AxisBar label="Z" value={az} color="#3b82f6" max={25} />
          </div>
          <div className="space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
              Giroscopio (rad/s)
            </span>
            <AxisBar label="X" value={gx} max={5} color="#f97316" />
            <AxisBar label="Y" value={gy} max={5} color="#a855f7" />
            <AxisBar label="Z" value={gz} max={5} color="#06b6d4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

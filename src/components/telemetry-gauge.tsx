"use client"

import { cn } from "@/lib/utils"

interface TelemetryGaugeProps {
  label: string
  value: number
  unit: string
  decimals?: number
  color?: string
  trend?: "up" | "down" | "stable"
  className?: string
}

export function TelemetryGauge({
  label,
  value,
  unit,
  decimals = 2,
  color,
  trend,
  className,
}: TelemetryGaugeProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent" />
      <div className="relative">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span
            className="text-4xl font-bold tabular-nums tracking-tight transition-colors duration-300"
            style={color ? { color } : undefined}
          >
            {value.toFixed(decimals)}
          </span>
          <span className="text-sm font-medium text-muted-foreground">{unit}</span>
          {trend && (
            <span
              className={cn("ml-auto text-sm font-semibold", {
                "text-emerald-500": trend === "up",
                "text-red-500": trend === "down",
                "text-muted-foreground": trend === "stable",
              })}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "–"}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SensorReading {
  label: string
  value: number
  unit: string
  decimals?: number
}

interface SensorCardProps {
  title: string
  subtitle?: string
  readings: SensorReading[]
  className?: string
}

export function SensorCard({ title, subtitle, readings, className }: SensorCardProps) {
  return (
    <Card className={cn("overflow-hidden border-border/50 shadow-sm transition-all duration-200 hover:shadow-md", className)}>
      <CardHeader className="border-b border-border/30 bg-gradient-to-r from-primary/[0.02] to-transparent pb-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </CardTitle>
        {subtitle && (
          <p className="text-xs text-muted-foreground/60">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {readings.map((r) => (
            <div key={r.label}>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                {r.label}
              </span>
              <p className="mt-0.5 text-lg font-semibold tabular-nums tracking-tight">
                {r.value.toFixed(r.decimals ?? 2)}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  {r.unit}
                </span>
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

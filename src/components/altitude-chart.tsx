"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { TelemetryData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface AltitudeChartProps {
  history: TelemetryData[]
  className?: string
}

const chartConfig: ChartConfig = {
  alt: {
    label: "Altitud",
    color: "hsl(var(--chart-1))",
  },
  vel: {
    label: "Velocidad",
    color: "hsl(var(--chart-2))",
  },
}

export function AltitudeChart({ history, className }: AltitudeChartProps) {
  const data = history.map((d, i) => ({
    time: ((d.t - (history[0]?.t ?? 0)) / 1000).toFixed(1),
    alt: d.alt,
    vel: d.vel,
  }))

  return (
    <Card className={cn("overflow-hidden border-border/50 shadow-sm", className)}>
      <CardHeader className="border-b border-border/30 pb-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Altitud y Velocidad
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="altGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-alt)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--color-alt)" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="velGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-vel)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--color-vel)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              width={36}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              width={36}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ stroke: "hsl(var(--border))", strokeDasharray: "3 3" }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="alt"
              stroke="var(--color-alt)"
              strokeWidth={2}
              fill="url(#altGradient)"
              dot={false}
              isAnimationActive={false}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="vel"
              stroke="var(--color-vel)"
              strokeWidth={2}
              fill="url(#velGradient)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

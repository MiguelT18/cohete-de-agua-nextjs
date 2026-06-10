"use client"

import { useMemo, useState } from "react"
import { AltitudeChart } from "@/components/altitude-chart"
import { ConnectionStatus } from "@/components/connection-status"
import { EspStatus } from "@/components/esp-status"
import { MPUDisplay } from "@/components/mpu-display"
import { SensorCard } from "@/components/sensor-card"
import { WifiConfig } from "@/components/wifi-config"
import { useTelemetry } from "@/hooks/use-telemetry"

function SecondaryMetric({
  label,
  value,
  unit,
  decimals = 1,
}: {
  label: string
  value: number
  unit: string
  decimals?: number
}) {
  return (
    <div className="flex items-baseline gap-1.5 rounded-lg bg-muted/30 px-3 py-2">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
        {label}
      </span>
      <span className="text-sm font-semibold tabular-nums text-foreground/80">
        {value.toFixed(decimals)}
      </span>
      <span className="text-[11px] text-muted-foreground/50">{unit}</span>
    </div>
  )
}

function FlightMetric({
  label,
  value,
  unit,
  max,
  icon,
  decimals = 2,
}: {
  label: string
  value: number
  unit: string
  max?: number
  icon: string
  decimals?: number
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {label}
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-4xl font-bold tabular-nums tracking-tight">
            {value.toFixed(decimals)}
          </span>
          <span className="text-sm font-medium text-muted-foreground">{unit}</span>
        </div>
        {max !== undefined && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground/60">
            <span className="uppercase tracking-wider">Máx</span>
            <span className="font-semibold tabular-nums text-foreground/70">
              {max.toFixed(decimals)} {unit}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export function TelemetryDashboard() {
  const { latest, history, sampleCount, lastUpdate, connected } = useTelemetry()
  const [showImu, setShowImu] = useState(false)

  const maxAlt = useMemo(
    () => (history.length > 0 ? Math.max(...history.map((d) => d.alt)) : 0),
    [history]
  )
  const maxVel = useMemo(
    () => (history.length > 0 ? Math.max(...history.map((d) => d.vel)) : 0),
    [history]
  )
  const maxAcc = useMemo(
    () => (history.length > 0 ? Math.max(...history.map((d) => Math.abs(d.acc))) : 0),
    [history]
  )
  const flightTime = latest ? latest.t / 1000 : 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cohete de Agua</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Experimento de física · Datos en tiempo real{" "}
            {connected ? "desde el ESP32" : "..."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <WifiConfig />
          <ConnectionStatus
            connected={connected}
            lastUpdate={lastUpdate}
            sampleCount={sampleCount}
          />
        </div>
      </div>

      <div className="mb-8">
        <EspStatus />
      </div>

      {!latest ? (
        <div className="flex animate-fade-in items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-card/30 p-20">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                className="h-6 w-6"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <p className="text-base font-medium text-muted-foreground">
              Esperando datos del ESP32...
            </p>
            <p className="mt-1 text-sm text-muted-foreground/60">
              Conectado al servidor SSE · esperando telemetría
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-0.5 w-3 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Vuelo
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <FlightMetric
                label="Altura"
                value={latest.alt}
                unit="m"
                max={maxAlt}
                icon="📏"
              />
              <FlightMetric
                label="Velocidad"
                value={latest.vel}
                unit="m/s"
                max={maxVel}
                icon="🚀"
              />
              <FlightMetric
                label="Aceleración"
                value={latest.acc}
                unit="m/s²"
                max={maxAcc}
                icon="⚡"
              />
              <FlightMetric
                label="Tiempo"
                value={flightTime}
                unit="s"
                decimals={1}
                icon="⏱"
              />
            </div>
          </div>

          <div className="mb-8">
            <AltitudeChart history={history} />
          </div>

          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-0.5 w-3 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Ambiente
              </span>
            </div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <SecondaryMetric label="Temp. interior" value={latest.b1t} unit="°C" />
              <SecondaryMetric label="Presión" value={latest.b1p} unit="hPa" decimals={2} />
              <SecondaryMetric label="Temp. ext. #1" value={latest.a1t} unit="°C" />
              <SecondaryMetric label="Humedad #1" value={latest.a1h} unit="%" />
              <SecondaryMetric label="Temp. ext. #2" value={latest.b2t} unit="°C" />
              <SecondaryMetric label="Presión #2" value={latest.b2p} unit="hPa" decimals={2} />
              <SecondaryMetric label="Temp. ext. #3" value={latest.a2t} unit="°C" />
              <SecondaryMetric label="Humedad #2" value={latest.a2h} unit="%" />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              <SensorCard
                title="BMP280 #1"
                subtitle="Bus 1 · Interior cápsula"
                readings={[
                  { label: "Temperatura", value: latest.b1t, unit: "°C" },
                  { label: "Presión", value: latest.b1p, unit: "hPa", decimals: 2 },
                ]}
              />
              <SensorCard
                title="AHT20 #1"
                subtitle="Bus 1 · Humedad y Temp."
                readings={[
                  { label: "Temperatura", value: latest.a1t, unit: "°C" },
                  { label: "Humedad", value: latest.a1h, unit: "%", decimals: 1 },
                ]}
              />
              <SensorCard
                title="BMP280 #2"
                subtitle="Bus 2 · Presión y Temp."
                readings={[
                  { label: "Temperatura", value: latest.b2t, unit: "°C" },
                  { label: "Presión", value: latest.b2p, unit: "hPa", decimals: 2 },
                ]}
              />
              <SensorCard
                title="AHT20 #2"
                subtitle="Bus 2 · Humedad y Temp."
                readings={[
                  { label: "Temperatura", value: latest.a2t, unit: "°C" },
                  { label: "Humedad", value: latest.a2h, unit: "%", decimals: 1 },
                ]}
              />
            </div>
          </div>

          <div className="mb-8">
            <button
              onClick={() => setShowImu((s) => !s)}
              className="mb-3 flex w-full items-center gap-2 text-left"
            >
              <div className="h-0.5 w-3 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                IMU · MPU6050
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`ml-auto h-4 w-4 text-muted-foreground/60 transition-transform duration-200 ${
                  showImu ? "rotate-180" : ""
                }`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {showImu && (
              <div className="animate-fade-in">
                <MPUDisplay
                  ax={latest.ax}
                  ay={latest.ay}
                  az={latest.az}
                  gx={latest.gx}
                  gy={latest.gy}
                  gz={latest.gz}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

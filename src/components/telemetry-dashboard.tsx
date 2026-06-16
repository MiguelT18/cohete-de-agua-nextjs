"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AltitudeChart } from "@/components/altitude-chart"
import { ConnectionStatus } from "@/components/connection-status"
import { EspStatus } from "@/components/esp-status"
import { MPUDisplay } from "@/components/mpu-display"
import { SensorCard } from "@/components/sensor-card"
import { WifiConfig } from "@/components/wifi-config"
import { useEspStatus } from "@/hooks/use-esp-status"
import { useTelemetry } from "@/hooks/use-telemetry"

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

function SectionTitle({ icon, children, color }: { icon: string; children: React.ReactNode; color?: string }) {
  return (
    <div className="mb-4 mt-8 flex items-center gap-3 border-b border-border/40 pb-2.5">
      <span className="text-base">{icon}</span>
      <span className="text-sm font-bold uppercase tracking-[0.15em]" style={color ? { color } : undefined}>
        {children}
      </span>
    </div>
  )
}

function getFlightPhase(t: number): string {
  const seconds = t / 1000
  if (seconds < 0.4) return "🚀 Empuje"
  if (seconds < 4.8) return "📈 Subida"
  if (seconds < 5.2) return "⛰️ Apogeo"
  if (seconds < 16) return "🪂 Descenso"
  return "🎯 Aterrizaje"
}

export function TelemetryDashboard() {
  const { latest, history, sampleCount, lastUpdate, connected } = useTelemetry()
  const { status, alive } = useEspStatus()
  const [showImu, setShowImu] = useState(false)
  const wasEverAlive = useRef(false)

  useEffect(() => {
    if (alive) wasEverAlive.current = true
  }, [alive])

  const disconnected = wasEverAlive.current && !alive

  const lanzado = status?.lanzado ?? false
  const aterrizado = status?.aterrizado ?? false

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

  const flightTime = aterrizado
    ? (status?.tiempoVuelo ?? 0) / 1000
    : lanzado
      ? (latest?.t ?? 0) / 1000
      : 0

  const phase = aterrizado
    ? "🪂 Aterrizado"
    : lanzado
      ? getFlightPhase(latest?.t ?? 0)
      : "⏳ Esperando lanzamiento..."

  const heroIcon = aterrizado ? "🪂" : lanzado ? "🚀" : "⏳"
  const heroTitle = aterrizado
    ? "VUELO COMPLETADO"
    : lanzado
      ? "VUELO ACTIVO"
      : "ESPERANDO LANZAMIENTO"

  const heroBg = aterrizado
    ? "border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent"
    : "border-primary/20 bg-gradient-to-br from-primary/[0.04] to-transparent"

  if (disconnected) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-10 w-10 text-muted-foreground/50"
            >
              <path d="M8.5 3.5A7 7 0 0 1 12 2a7 7 0 0 1 7 7c0 1.5-.5 2.8-1.2 3.8" />
              <path d="M3.5 8.5A7 7 0 0 0 5 12l5 4-2 5 5-2.5" />
              <path d="M14.5 17.5A5 5 0 0 1 9 14" />
              <path d="M18.5 4.5 4.5 18.5" />
              <path d="m21 3-2 2" />
              <path d="m5 19-2 2" />
            </svg>
          </div>
          <p className="text-xl font-bold tracking-tight text-foreground">ESP32 desconectado</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            El ESP32 ha perdido la conexión. Esperando que se reconecte para reanudar la telemetría...
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground/50">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
            Reconectando automáticamente
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header row */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <span>🚀</span> Cohete de Agua
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Panel de telemetría en tiempo real · Experimentos de física con ESP32
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

      {/* Estado general del ESP32 */}
      <div className="mb-6">
        <EspStatus />
      </div>

      {!latest ? (
        /* Empty state — explicativo para quienes no conocen el proyecto */
        <div className="flex animate-fade-in items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-card/30 p-16">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                className="h-8 w-8"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-foreground">Esperando datos del cohete</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Este panel recibe en vivo las lecturas de los sensores a bordo del cohete de agua
              (altura, velocidad, presión, temperatura, humedad e IMU) a través de la conexión WiFi del ESP32.
            </p>
            <p className="mt-3 text-xs text-muted-foreground/60">
              Asegurate de que el ESP32 esté encendido y transmitiendo datos.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Hero — estado actual del vuelo */}
          <div className={`mb-8 overflow-hidden rounded-2xl border p-6 shadow-sm ${heroBg}`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{heroIcon}</span>
                <div>
                  <p className="text-lg font-bold tracking-tight">{heroTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {sampleCount} muestras registradas · {history.length} puntos en gráfica
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-secondary/50 px-4 py-2 text-sm">
                <span className="text-muted-foreground">Fase:</span>
                <span className="font-semibold">{phase}</span>
              </div>
            </div>
          </div>

          {/* 📊 Métricas del vuelo */}
          <SectionTitle icon="📊">Métricas del vuelo</SectionTitle>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <FlightMetric label="Altura" value={latest.alt} unit="m" max={maxAlt} icon="📏" />
            <FlightMetric label="Velocidad" value={latest.vel} unit="m/s" max={maxVel} icon="🚀" />
            <FlightMetric label="Aceleración" value={latest.acc} unit="m/s²" max={maxAcc} icon="⚡" />
            <FlightMetric label="Tiempo" value={flightTime} unit="s" decimals={1} icon="⏱️" />
          </div>

          {/* 📈 Gráfica del vuelo */}
          <SectionTitle icon="📈">Altitud y velocidad</SectionTitle>
          <div className="mb-6">
            <AltitudeChart history={history} />
          </div>

          {/* 🔬 Sensores ambientales */}
          <SectionTitle icon="🔬">Sensores ambientales</SectionTitle>
          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <SensorCard
              title="BMP280 #1"
              subtitle="Interior cápsula"
              readings={[
                { label: "Temperatura", value: latest.b1t, unit: "°C" },
                { label: "Presión", value: latest.b1p, unit: "hPa", decimals: 2 },
              ]}
            />
            <SensorCard
              title="AHT20 #1"
              subtitle="Bus 1"
              readings={[
                { label: "Temperatura", value: latest.a1t, unit: "°C" },
                { label: "Humedad", value: latest.a1h, unit: "%", decimals: 1 },
              ]}
            />
            <SensorCard
              title="BMP280 #2"
              subtitle="Bus 2"
              readings={[
                { label: "Temperatura", value: latest.b2t, unit: "°C" },
                { label: "Presión", value: latest.b2p, unit: "hPa", decimals: 2 },
              ]}
            />
            <SensorCard
              title="AHT20 #2"
              subtitle="Bus 2"
              readings={[
                { label: "Temperatura", value: latest.a2t, unit: "°C" },
                { label: "Humedad", value: latest.a2h, unit: "%", decimals: 1 },
              ]}
            />
          </div>

          {/* ⚙️ IMU — colapsable */}
          <SectionTitle icon="⚙️">IMU · MPU6050</SectionTitle>
          <div className="mb-6">
            <button
              onClick={() => setShowImu((s) => !s)}
              className="mb-3 flex w-full items-center gap-2 rounded-lg border border-border/30 bg-card/50 px-4 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-card/80"
            >
              <span>{showImu ? "🔽" : "▶️"} Ver lecturas del acelerómetro y giroscopio</span>
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

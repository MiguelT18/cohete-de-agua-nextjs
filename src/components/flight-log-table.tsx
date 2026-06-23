"use client"

import { useEffect, useState } from "react"
import { FlightLog } from "@/lib/types"

function formatDate(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function FlightLogTable() {
  const [flights, setFlights] = useState<FlightLog[]>([])

  useEffect(() => {
    function load() {
      fetch("/api/flights")
        .then((r) => r.json())
        .then(setFlights)
    }
    load()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [])

  if (flights.length === 0) return null

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="border-b border-border/30 bg-gradient-to-r from-primary/[0.02] to-transparent px-5 py-3.5">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          📋 Historial de vuelos
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/20 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground/60">
              <th className="px-5 py-3">#</th>
              <th className="px-5 py-3">Fecha</th>
              <th className="px-5 py-3">Duración</th>
              <th className="px-5 py-3">Altura máx</th>
              <th className="px-5 py-3">Velocidad máx</th>
              <th className="px-5 py-3">Aceleración máx</th>
              <th className="px-5 py-3">Muestras</th>
            </tr>
          </thead>
          <tbody>
            {[...flights].reverse().map((f) => (
              <tr
                key={f.id}
                className="border-b border-border/10 transition-colors last:border-0 hover:bg-muted/30"
              >
                <td className="px-5 py-3 font-medium tabular-nums">{f.id}</td>
                <td className="px-5 py-3 text-muted-foreground">{formatDate(f.timestamp)}</td>
                <td className="px-5 py-3 tabular-nums">{f.duration.toFixed(1)} s</td>
                <td className="px-5 py-3 tabular-nums">{f.maxAlt.toFixed(2)} m</td>
                <td className="px-5 py-3 tabular-nums">{f.maxVel.toFixed(2)} m/s</td>
                <td className="px-5 py-3 tabular-nums">{f.maxAcc.toFixed(2)} m/s²</td>
                <td className="px-5 py-3 tabular-nums text-muted-foreground">{f.samples}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

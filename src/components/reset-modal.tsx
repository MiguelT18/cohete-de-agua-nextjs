"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ResetModalProps {
  trigger: React.ReactNode
}

export function ResetModal({ trigger }: ResetModalProps) {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<"hidden" | "in" | "out">("hidden")
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle")

  const close = useCallback(() => {
    setPhase("out")
    setTimeout(() => {
      setMounted(false)
      setPhase("hidden")
      setStatus("idle")
    }, 200)
  }, [])

  function openModal() {
    setSending(false)
    setStatus("idle")
    setMounted(true)
    setPhase("hidden")
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPhase("in")
      })
    })
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close()
    }
    if (mounted) document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [mounted, close])

  async function handleReset() {
    setSending(true)
    setStatus("idle")
    try {
      const res = await fetch("/api/reset", { method: "POST" })
      if (res.ok) {
        setStatus("ok")
        setTimeout(() => close(), 2000)
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    } finally {
      setSending(false)
    }
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget && !sending) close()
  }

  return (
    <>
      <div onClick={openModal}>{trigger}</div>

      {mounted && (
        <div
          className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-colors duration-200 ${
            phase === "in" ? "bg-black/40 backdrop-blur-sm" : "bg-transparent pointer-events-none"
          }`}
          onClick={handleOverlayClick}
        >
          <div
            className={`w-full sm:max-w-sm mx-0 sm:mx-4 transition-all duration-200 ${
              phase === "in"
                ? "translate-y-0 sm:scale-100 opacity-100"
                : "translate-y-full sm:translate-y-0 sm:scale-95 opacity-0"
            }`}
            style={{ transformOrigin: "bottom center" }}
          >
            <Card className="border-border/50 shadow-xl rounded-b-none sm:rounded-b-xl">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 pb-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Nuevo vuelo
                </CardTitle>
                <button
                  onClick={close}
                  disabled={sending}
                  className="text-muted-foreground/60 hover:text-foreground transition-colors disabled:opacity-30"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {status === "ok" ? (
                  <div className="flex flex-col items-center gap-2 py-4 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-emerald-500">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      Datos reiniciados
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Listo para un nuevo lanzamiento
                    </p>
                  </div>
                ) : sending ? (
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                      <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
                    </div>
                  </div>
                ) : status === "error" ? (
                  <div className="flex flex-col items-center gap-3 py-4 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-red-500">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      Error al reiniciar
                    </p>
                    <Button variant="outline" size="sm" onClick={close}>
                      Cerrar
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-amber-500">
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        ¿Reiniciar datos de telemetría?
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Se borrarán todas las muestras y el historial del vuelo actual.
                        El ESP32 seguirá transmitiendo datos nuevos.
                      </p>
                    </div>
                    <div className="flex w-full gap-2">
                      <Button variant="outline" onClick={close} className="flex-1">
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleReset}
                        className="flex-1"
                      >
                        Reiniciar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}

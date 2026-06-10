"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WifiConfig() {
  const [mounted, setMounted] = useState(false)
  const [phase, setPhase] = useState<"hidden" | "in" | "out">("hidden")
  const [ssid, setSsid] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle")
  const cancelRef = useRef(false)

  const close = useCallback(() => {
    if (cancelRef.current) return
    setPhase("out")
    setTimeout(() => {
      setMounted(false)
      setPhase("hidden")
      setStatus("idle")
    }, 200)
  }, [])

  function openModal() {
    cancelRef.current = false
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ssid.trim()) return
    setSending(true)
    setStatus("idle")
    try {
      const res = await fetch("/api/wifi/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ssid: ssid.trim(), password }),
      })
      if (res.ok) {
        setStatus("ok")
        cancelRef.current = true
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
    if (e.target === e.currentTarget) close()
  }

  if (!mounted) return (
    <Button variant="outline" size="sm" onClick={openModal}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4"
      >
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <circle cx="12" cy="20" r="1" />
      </svg>
      WiFi
    </Button>
  )

  const show = phase === "in"

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-colors duration-200 ${
        show ? "bg-black/40 backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={handleOverlayClick}
    >
      <div
        className={`w-full sm:max-w-sm mx-0 sm:mx-4 transition-all duration-200 ${
          show
            ? "translate-y-0 sm:scale-100 opacity-100"
            : "translate-y-full sm:translate-y-0 sm:scale-95 opacity-0"
        }`}
        style={{ transformOrigin: "bottom center" }}
      >
        <Card className="border-border/50 shadow-xl rounded-b-none sm:rounded-b-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Configurar WiFi
            </CardTitle>
            <button
              onClick={close}
              className="text-muted-foreground/60 hover:text-foreground transition-colors"
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
                  Configuración enviada
                </p>
                <p className="text-xs text-muted-foreground">
                  El ESP32 se reconectará en segundos
                </p>
              </div>
            ) : sending ? (
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                  <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
                </div>
                <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    SSID
                  </label>
                  <input
                    type="text"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                    placeholder="Nombre de la red WiFi"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Contraseña
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                          <path d="m1 1 22 22" />
                          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                {status === "error" && (
                  <p className="text-xs text-red-500">Error al enviar configuración</p>
                )}
                <Button type="submit" disabled={sending || !ssid.trim()} className="w-full">
                  Conectar
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

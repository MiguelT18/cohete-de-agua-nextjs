"use client"

import { useEspStatus } from "@/hooks/use-esp-status";

export function EspStatus() {
  const { status, alive } = useEspStatus();

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg px-3 py-1.5 text-xs transition-colors ${
      alive ? "bg-muted/30" : "bg-red-500/5"
    }`}>
      {!status ? (
        <span className="text-muted-foreground/60">Estado: esperando ESP32...</span>
      ) : (
        <>
          <span className="flex items-center gap-1.5">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${!alive ? "bg-gray-400" : status.wifi ? "bg-emerald-500" : "bg-red-500"}`} />
            <span className="text-muted-foreground">WiFi</span>
            <span className={`font-medium ${!alive ? "text-gray-400" : status.wifi ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {!alive ? "—" : status.wifi ? `${status.rssi} dBm` : "NO"}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${!alive ? "bg-gray-400" : status.sd ? "bg-emerald-500" : "bg-red-500"}`} />
            <span className="text-muted-foreground">Tarjeta SD</span>
            <span className={`font-medium ${!alive ? "text-gray-400" : status.sd ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {!alive ? "—" : status.sd ? "OK" : "NO"}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${!alive ? "bg-gray-400" : status.bt ? "bg-emerald-500" : "bg-red-500"}`} />
            <span className="text-muted-foreground">Bluetooth</span>
            <span className={`font-medium ${!alive ? "text-gray-400" : status.bt ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {!alive ? "—" : status.bt ? "OK" : "NO"}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${!alive ? "bg-gray-400" : status.bmp1 && status.aht1 && status.mpu && status.bmp2 && status.aht2 ? "bg-emerald-500" : "bg-amber-500"}`} />
            <span className="text-muted-foreground">Sensores</span>
            <span className={`font-medium ${!alive ? "text-gray-400" : "text-foreground/80"}`}>
              {!alive ? "—" : `${[status.bmp1, status.aht1, status.mpu, status.bmp2, status.aht2].filter(Boolean).length}/5`}
            </span>
          </span>
        </>
      )}
    </div>
  );
}

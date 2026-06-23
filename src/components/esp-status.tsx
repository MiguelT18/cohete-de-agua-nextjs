"use client"

import { useEspStatus } from "@/hooks/use-esp-status";

const SENSORS: { key: keyof { bmp1: boolean; bmp2: boolean; aht1: boolean; aht2: boolean; mpu: boolean }; label: string }[] = [
  { key: "bmp1", label: "BMP280 #1" },
  { key: "aht1", label: "AHT20 #1" },
  { key: "mpu", label: "MPU6050" },
  { key: "bmp2", label: "BMP280 #2" },
  { key: "aht2", label: "AHT20 #2" },
];

export function EspStatus() {
  const { status, alive } = useEspStatus();

  return (
    <div className={`rounded-lg px-3 py-2 text-xs transition-colors ${
      alive ? "bg-muted/30" : "bg-red-500/5"
    }`}>
      {!status ? (
        <span className="text-muted-foreground/60">Estado: esperando ESP32...</span>
      ) : (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span className="flex items-center gap-1.5">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${status.wifi ? "bg-emerald-500" : "bg-red-500"}`} />
            <span className="text-muted-foreground">WiFi</span>
            <span className={`font-medium ${status.wifi ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {status.wifi ? `${status.rssi} dBm` : "NO"}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${status.sd ? "bg-emerald-500" : "bg-red-500"}`} />
            <span className="text-muted-foreground">SD</span>
            <span className={`font-medium ${status.sd ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
              {status.sd ? "OK" : "NO"}
            </span>
          </span>

          {SENSORS.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${status[s.key] ? "bg-emerald-500" : "bg-red-500"}`} />
              <span className="text-muted-foreground">{s.label}</span>
              <span className={`font-medium ${status[s.key] ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {status[s.key] ? "OK" : "NO"}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

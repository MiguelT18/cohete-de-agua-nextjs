"use client"

import { useEspStatus } from "@/hooks/use-esp-status";

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${
        ok
          ? "bg-emerald-500 shadow-[0_0_6px] shadow-emerald-500/50"
          : "bg-red-500"
      }`}
    />
  );
}

function StatusLabel({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-xs">
      <StatusDot ok={ok} />
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground/80">
        {ok ? "OK" : "ERROR"}
      </span>
    </span>
  );
}

function SensorBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium leading-tight ${
        ok
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "bg-red-500/10 text-red-600 dark:text-red-400"
      }`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          ok
            ? "bg-emerald-500"
            : "bg-red-500"
        }`}
      />
      {label}
    </span>
  );
}

export function EspStatus() {
  const status = useEspStatus();

  if (!status) {
    return (
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Estado del ESP32
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground/60">
          Esperando reporte de estado...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            status.wifi
              ? "bg-emerald-500 animate-pulse shadow-[0_0_6px] shadow-emerald-500/50"
              : "bg-red-500"
          }`}
        />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Estado del ESP32
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg bg-muted/30 p-3">
          <StatusLabel label="WiFi" ok={status.wifi} />
          {status.wifi && (
            <p className="mt-1 text-[11px] text-muted-foreground/50">
              {status.rssi} dBm
            </p>
          )}
        </div>
        <div className="rounded-lg bg-muted/30 p-3">
          <StatusLabel label="SD" ok={status.sd} />
        </div>
        <div className="rounded-lg bg-muted/30 p-3">
          <StatusLabel label="Bluetooth" ok={status.bt} />
        </div>
        <div className="rounded-lg bg-muted/30 p-3">
          <StatusLabel label="Enlace" ok={status.wifi} />
          {status.wifi && (
            <p className="mt-1 text-[11px] text-muted-foreground/50">
              Conectado
            </p>
          )}
        </div>
      </div>

      <div className="mt-3">
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
          Sensores
        </p>
        <div className="flex flex-wrap gap-1.5">
          <SensorBadge label="BMP1" ok={status.bmp1} />
          <SensorBadge label="AHT1" ok={status.aht1} />
          <SensorBadge label="MPU" ok={status.mpu} />
          <SensorBadge label="BMP2" ok={status.bmp2} />
          <SensorBadge label="AHT2" ok={status.aht2} />
        </div>
      </div>
    </div>
  );
}

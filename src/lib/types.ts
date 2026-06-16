export interface TelemetryData {
  t: number;
  alt: number;
  vel: number;
  acc: number;
  b1t: number;
  b1p: number;
  a1t: number;
  a1h: number;
  ax: number;
  ay: number;
  az: number;
  gx: number;
  gy: number;
  gz: number;
  b2t: number;
  b2p: number;
  a2t: number;
  a2h: number;
}

export interface TelemetrySnapshot {
  latest: TelemetryData | null;
  history: TelemetryData[];
  sampleCount: number;
  lastUpdate: number | null;
  connected: boolean;
}

export interface EspStatus {
  wifi: boolean;
  rssi: number;
  sd: boolean;
  bmp1: boolean;
  aht1: boolean;
  mpu: boolean;
  bmp2: boolean;
  aht2: boolean;
  lanzado?: boolean;
  aterrizado?: boolean;
  tiempoVuelo?: number;
}

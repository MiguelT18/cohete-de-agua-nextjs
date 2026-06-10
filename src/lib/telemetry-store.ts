import { TelemetryData } from "./types";

const MAX_HISTORY = 400;
const DISCONNECT_TIMEOUT = 3000;

class TelemetryStore {
  private latest: TelemetryData | null = null;
  private history: TelemetryData[] = [];
  private sampleCount = 0;
  private lastUpdate: number | null = null;
  private subscribers = new Set<(data: TelemetryData) => void>();

  addReading(data: TelemetryData): void {
    this.latest = { ...data, t: data.t };
    this.history.push({ ...data });
    if (this.history.length > MAX_HISTORY) {
      this.history.shift();
    }
    this.sampleCount++;
    this.lastUpdate = Date.now();
    this.notify(data);
  }

  getSnapshot() {
    const now = Date.now();
    const connected =
      this.lastUpdate !== null && now - this.lastUpdate < DISCONNECT_TIMEOUT;
    return {
      latest: this.latest ? { ...this.latest } : null,
      history: [...this.history],
      sampleCount: this.sampleCount,
      lastUpdate: this.lastUpdate,
      connected,
    };
  }

  subscribe(callback: (data: TelemetryData) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify(data: TelemetryData): void {
    for (const cb of this.subscribers) {
      try {
        cb(data);
      } catch {
        this.subscribers.delete(cb);
      }
    }
  }
}

export const telemetryStore = new TelemetryStore();

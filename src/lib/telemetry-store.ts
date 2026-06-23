import { TelemetryData } from "./types";

const MAX_HISTORY = 400;
const DISCONNECT_TIMEOUT = 60000;
const KV_PREFIX = "telemetry:";

function hasKv(): boolean {
  return !!(process.env.KV_URL || process.env.KV_REST_API_URL);
}

async function kvAddReading(data: TelemetryData): Promise<void> {
  const { kv } = await import("@vercel/kv");
  const serialized = JSON.stringify(data);
  await kv.lpush(`${KV_PREFIX}readings`, serialized);
  await kv.ltrim(`${KV_PREFIX}readings`, 0, MAX_HISTORY - 1);
  await kv.incr(`${KV_PREFIX}count`);
  await kv.set(`${KV_PREFIX}lastUpdate`, Date.now());
  await kv.set(`${KV_PREFIX}latest`, serialized);
}

async function kvGetSnapshot(): Promise<{
  latest: TelemetryData | null;
  history: TelemetryData[];
  sampleCount: number;
  lastUpdate: number | null;
  connected: boolean;
}> {
  const { kv } = await import("@vercel/kv");
  const [rawReadings, count, lastUpdate, rawLatest] = await Promise.all([
    kv.lrange(`${KV_PREFIX}readings`, 0, MAX_HISTORY - 1),
    kv.get<number>(`${KV_PREFIX}count`),
    kv.get<number>(`${KV_PREFIX}lastUpdate`),
    kv.get<string>(`${KV_PREFIX}latest`),
  ]);
  const now = Date.now();
  const latest: TelemetryData | null = rawLatest ? JSON.parse(rawLatest) : null;
  const history: TelemetryData[] = (rawReadings || []).map((r: string) => JSON.parse(r)).reverse();
  return {
    latest,
    history,
    sampleCount: count || 0,
    lastUpdate: lastUpdate || null,
    connected: lastUpdate !== null && now - lastUpdate < DISCONNECT_TIMEOUT,
  };
}

async function kvReset(): Promise<void> {
  const { kv } = await import("@vercel/kv");
  await Promise.all([
    kv.del(`${KV_PREFIX}readings`),
    kv.del(`${KV_PREFIX}count`),
    kv.del(`${KV_PREFIX}lastUpdate`),
    kv.del(`${KV_PREFIX}latest`),
  ]);
}

class MemoryTelemetryStore {
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

  reset(): void {
    this.latest = null;
    this.history = [];
    this.sampleCount = 0;
    this.lastUpdate = null;
    for (const cb of this.subscribers) {
      try {
        cb({} as TelemetryData);
      } catch {
        this.subscribers.delete(cb);
      }
    }
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

class HybridTelemetryStore {
  private mem: MemoryTelemetryStore;
  private useKv: boolean;

  constructor() {
    this.mem = new MemoryTelemetryStore();
    this.useKv = hasKv();
    if (this.useKv) {
      console.log("[telemetry-store] Using Vercel KV for persistence");
    }
  }

  async addReading(data: TelemetryData): Promise<void> {
    if (this.useKv) {
      try {
        await kvAddReading(data);
        return;
      } catch (e) {
        console.warn("[telemetry-store] KV write failed, falling back to memory", e);
        this.useKv = false;
      }
    }
    this.mem.addReading(data);
  }

  async getSnapshot(): Promise<{
    latest: TelemetryData | null;
    history: TelemetryData[];
    sampleCount: number;
    lastUpdate: number | null;
    connected: boolean;
  }> {
    if (this.useKv) {
      try {
        return await kvGetSnapshot();
      } catch (e) {
        console.warn("[telemetry-store] KV read failed, falling back to memory", e);
        this.useKv = false;
      }
    }
    return this.mem.getSnapshot();
  }

  async reset(): Promise<void> {
    if (this.useKv) {
      try {
        await kvReset();
        return;
      } catch {
        this.useKv = false;
      }
    }
    this.mem.reset();
  }

  subscribe(callback: (data: TelemetryData) => void): () => void {
    return this.mem.subscribe(callback);
  }
}

export const telemetryStore = new HybridTelemetryStore();

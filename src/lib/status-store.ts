import { EspStatus } from "./types";

const STALE_TIMEOUT = 10000;
const KV_PREFIX = "status:";

function hasKv(): boolean {
  return !!(process.env.KV_URL || process.env.KV_REST_API_URL);
}

async function kvUpdate(data: EspStatus): Promise<void> {
  const { kv } = await import("@vercel/kv");
  await kv.set(`${KV_PREFIX}data`, JSON.stringify(data));
  await kv.set(`${KV_PREFIX}lastUpdate`, Date.now());
}

async function kvGetStatus(): Promise<EspStatus | null> {
  const { kv } = await import("@vercel/kv");
  const [rawData, lastUpdate] = await Promise.all([
    kv.get<string>(`${KV_PREFIX}data`),
    kv.get<number>(`${KV_PREFIX}lastUpdate`),
  ]);
  if (!lastUpdate || Date.now() - lastUpdate > STALE_TIMEOUT) return null;
  return rawData ? JSON.parse(rawData) : null;
}

class StatusStore {
  private status: EspStatus | null = null;
  private lastUpdate: number | null = null;
  private useKv: boolean;

  constructor() {
    this.useKv = hasKv();
  }

  async update(data: EspStatus): Promise<void> {
    this.status = { ...data };
    this.lastUpdate = Date.now();
    if (this.useKv) {
      try {
        await kvUpdate(data);
        return;
      } catch {
        this.useKv = false;
      }
    }
  }

  async getStatus(): Promise<EspStatus | null> {
    if (this.useKv) {
      try {
        return await kvGetStatus();
      } catch {
        this.useKv = false;
      }
    }
    if (this.lastUpdate !== null && Date.now() - this.lastUpdate > STALE_TIMEOUT)
      return null;
    return this.status ? { ...this.status } : null;
  }

  async reset(): Promise<void> {
    this.status = null;
    this.lastUpdate = null;
    if (this.useKv) {
      try {
        const { kv } = await import("@vercel/kv");
        await Promise.all([
          kv.del(`${KV_PREFIX}data`),
          kv.del(`${KV_PREFIX}lastUpdate`),
        ]);
      } catch {
        this.useKv = false;
      }
    }
  }
}

export const statusStore = new StatusStore();

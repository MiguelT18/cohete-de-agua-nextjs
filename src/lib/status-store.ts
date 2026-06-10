import { EspStatus } from "./types";

const STALE_TIMEOUT = 10000;

class StatusStore {
  private status: EspStatus | null = null;
  private lastUpdate: number | null = null;

  update(data: EspStatus): void {
    this.status = { ...data };
    this.lastUpdate = Date.now();
  }

  getStatus(): EspStatus | null {
    if (this.lastUpdate !== null && Date.now() - this.lastUpdate > STALE_TIMEOUT)
      return null;
    return this.status ? { ...this.status } : null;
  }
}

export const statusStore = new StatusStore();

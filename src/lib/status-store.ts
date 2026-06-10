import { EspStatus } from "./types";

class StatusStore {
  private status: EspStatus | null = null;

  update(data: EspStatus): void {
    this.status = { ...data };
  }

  getStatus(): EspStatus | null {
    return this.status ? { ...this.status } : null;
  }
}

export const statusStore = new StatusStore();

import { FlightLog } from "./types";

class FlightStore {
  private flights: FlightLog[] = [];
  private nextId = 1;

  add(entry: Omit<FlightLog, "id">): FlightLog {
    const flight: FlightLog = { id: this.nextId++, ...entry };
    this.flights.push(flight);
    return flight;
  }

  getAll(): FlightLog[] {
    return [...this.flights];
  }

  clear(): void {
    this.flights = [];
    this.nextId = 1;
  }
}

export const flightStore = new FlightStore();

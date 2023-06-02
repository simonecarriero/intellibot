import { FreeSpot } from '../domain/FreeSpot';
import { Ports } from '../domain/Ports';

export type CheckBookingRequests = () => Promise<FreeSpot[]>;

export const curriedCheckBookingRequests =
  (ports: Pick<Ports, 'getBookingRequests' | 'getFreeSpots'>): CheckBookingRequests =>
  async (): Promise<FreeSpot[]> => {
    const requests = await ports.getBookingRequests();
    return (await Promise.all(requests.map((r) => ports.getFreeSpots(r.date, r.from, r.to)))).flat();
  };

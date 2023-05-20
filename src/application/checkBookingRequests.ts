import { FreeSpot } from '../domain/FreeSpot';
import { Ports } from '../domain/Ports';

export const curriedCheckBookingRequests =
  (ports: Pick<Ports, 'getBookingRequests' | 'getFreeSpots'>) => async (): Promise<FreeSpot[]> => {
    const requests = await ports.getBookingRequests();
    return requests.flatMap((r) => ports.getFreeSpots(r.date, r.from, r.to));
  };

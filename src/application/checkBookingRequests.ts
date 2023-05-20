import { GetBookingRequests } from '../domain/BookingRequest';
import { FreeSpot, GetFreeSpots } from '../domain/FreeSpot';

export const checkBookingRequests =
  (getBookingRequests: GetBookingRequests, getFreeSpots: GetFreeSpots) => async (): Promise<FreeSpot[]> => {
    const requests = await getBookingRequests();
    return requests.flatMap((r) => getFreeSpots(r.date, r.from, r.to));
  };

import { GetBookingRequests } from '../domain/BookingRequest';
import { FreeSpot, GetFreeSpots } from '../domain/FreeSpot';

export const checkBookingRequests =
  (getBookingRequests: GetBookingRequests, getFreeSpots: GetFreeSpots) => (): FreeSpot[] => {
    return getBookingRequests().flatMap((r) => getFreeSpots(r.date, r.from, r.to));
  };

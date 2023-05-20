import { BookingRequest } from '../domain/BookingRequest';
import { FreeSpot } from '../domain/FreeSpot';

export type UseCases = {
  getPendingBookingRequests: () => Promise<BookingRequest[]>;
  requestBooking: (request: BookingRequest) => Promise<void>;
  checkBookingRequests: () => Promise<FreeSpot[]>;
};

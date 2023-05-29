import { BookingRequest } from '../domain/BookingRequest';
import { Ports } from '../domain/Ports';

export type GetPendingBookingRequests = () => Promise<BookingRequest[]>;

export const curriedGetPendingBookingRequests = (ports: Pick<Ports, 'getBookingRequests'>): GetPendingBookingRequests =>
  ports.getBookingRequests;

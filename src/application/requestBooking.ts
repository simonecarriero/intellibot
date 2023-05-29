import { BookingRequest } from '../domain/BookingRequest';
import { Ports } from '../domain/Ports';

export type RequestBooking = (request: BookingRequest) => Promise<void>;

export const curriedRequestBooking = (ports: Pick<Ports, 'addBookingRequest'>): RequestBooking =>
  ports.addBookingRequest;

import { BookingRequest } from '../domain/BookingRequest';
import { Ports } from '../domain/Ports';
import * as TE from 'fp-ts/lib/TaskEither';

export type RequestBooking = (request: BookingRequest) => TE.TaskEither<Error, void>;

export const curriedRequestBooking = (ports: Pick<Ports, 'addBookingRequest'>): RequestBooking =>
  ports.addBookingRequest;

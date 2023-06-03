import { BookingRequest } from '../domain/BookingRequest';
import { Ports } from '../domain/Ports';
import * as TE from 'fp-ts/lib/TaskEither';

export type GetPendingBookingRequests = () => TE.TaskEither<Error, BookingRequest[]>;

export const curriedGetPendingBookingRequests = (ports: Pick<Ports, 'getBookingRequests'>): GetPendingBookingRequests =>
  ports.getBookingRequests;

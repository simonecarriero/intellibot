import { BookingRequestRepository, BookingRequest } from '../domain/BookingRequest';
import * as TE from 'fp-ts/lib/TaskEither';

export type RequestBooking = (request: BookingRequest) => TE.TaskEither<Error, void>;

export const requestBooking = (bookingRequestRepository: BookingRequestRepository): RequestBooking =>
  bookingRequestRepository.add;

import { BookingRequestRepository, BookingRequest } from '../domain/BookingRequest';
import * as TE from 'fp-ts/lib/TaskEither';

export type GetPendingBookingRequests = () => TE.TaskEither<Error, BookingRequest[]>;

export const getPendingBookingRequests = (
  bookingRequestRepository: BookingRequestRepository,
): GetPendingBookingRequests => bookingRequestRepository.get;

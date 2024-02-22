import { BookingRequestRepository } from '../domain/BookingRequest';
import { FreeSpot, FreeSpotRepository } from '../domain/FreeSpot';
import * as A from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';

export type CheckBookingRequests = () => TE.TaskEither<Error, FreeSpot[]>;

export const checkBookingRequests = (
  bookingRequestRepository: BookingRequestRepository,
  freeSpotRepository: FreeSpotRepository,
): TE.TaskEither<Error, readonly FreeSpot[]> =>
  pipe(
    bookingRequestRepository.get(),
    TE.flatMap((requests) => pipe(requests, TE.traverseArray(freeSpotRepository.get), TE.map(A.flatten))),
  );

import { BookingRequest, BookingRequestRepository } from '../domain/BookingRequest';
import { FreeSpotRepository } from '../domain/FreeSpot';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';

export const book = (
  bookingRequestRepository: BookingRequestRepository,
  freeSpotRepository: FreeSpotRepository,
): TE.TaskEither<Error, void> => {
  const tryBooking = (request: BookingRequest): TE.TaskEither<Error, void> => {
    return pipe(
      freeSpotRepository.get(request),
      TE.flatMap((spots) => (spots.length > 0 ? freeSpotRepository.book(spots[0]) : TE.of(undefined))),
    );
  };

  return pipe(
    bookingRequestRepository.get(),
    TE.flatMap((requests) =>
      pipe(
        requests,
        TE.traverseSeqArray(tryBooking),
        TE.map((a) => a as unknown as void),
      ),
    ),
  );
};

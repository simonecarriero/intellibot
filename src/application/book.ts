import { BookingRequest, BookingRequestRepository } from '../domain/BookingRequest';
import { FreeSpot, FreeSpotRepository } from '../domain/FreeSpot';
import { UserRepository } from '../domain/User';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { sequenceT } from 'fp-ts/lib/Apply';
import { pipe } from 'fp-ts/lib/function';

export const book = (
  bookingRequestRepository: BookingRequestRepository,
  freeSpotRepository: FreeSpotRepository,
  userRepository: UserRepository,
): TE.TaskEither<Error, readonly [BookingRequest, FreeSpot][]> => {
  const tryBooking = (request: BookingRequest): TE.TaskEither<Error, O.Option<[BookingRequest, FreeSpot]>> => {
    return pipe(
      sequenceT(TE.ApplyPar)(userRepository.get(request.user || 'Jane'), freeSpotRepository.get(request)),
      TE.flatMap(([user, spots]) => {
        if (spots.length === 0) {
          return TE.right(O.none);
        }
        return pipe(
          freeSpotRepository.book(spots[0], user),
          TE.flatMap((_) => bookingRequestRepository.delete(request)),
          TE.map((_) => O.some([request, { ...spots[0], user }])),
        );
      }),
    );
  };

  return pipe(
    bookingRequestRepository.get(),
    TE.flatMap((r) => pipe(r, TE.traverseSeqArray(tryBooking))),
    TE.map((r) => pipe(r, A.compact)),
  );
};

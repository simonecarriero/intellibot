import { BookingRequest } from '../../domain/BookingRequest';
import { FreeSpot, FreeSpotRepository, User } from '../../domain/FreeSpot';
import { goe, loe } from '../../domain/JustTime';
import * as TE from 'fp-ts/TaskEither';

export class FreeSpotRepositoryInMemory implements FreeSpotRepository {
  constructor(private state: FreeSpot[] = []) {}

  get = (request: BookingRequest): TE.TaskEither<Error, FreeSpot[]> => {
    return TE.of(
      this.state
        .filter(
          (s) =>
            s.date.year === request.date.year && s.date.month === request.date.month && s.date.day === request.date.day,
        )
        .filter((s) => goe(s.time, request.from))
        .filter((s) => loe(s.time, request.to)),
    );
  };

  book = (freeSpot: FreeSpot, user: User): TE.TaskEither<Error, void> => {
    const index = this.state.findIndex((f) => f.date === freeSpot.date && f.time === freeSpot.time);
    if (index !== -1) {
      this.state.splice(index, 1);
    }
    return TE.of(undefined);
  };
}

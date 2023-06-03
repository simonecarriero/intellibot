import { FreeSpot } from '../../domain/FreeSpot';
import { goe, loe, justTimeFromDate } from '../../domain/JustTime';
import { Ports } from '../../domain/Ports';
import * as TE from 'fp-ts/TaskEither';

export const curriedGetFreeSpots: (state: FreeSpot[]) => Ports['getFreeSpots'] = (state) => (request) =>
  TE.of(
    state
      .filter(
        (s) =>
          s.date.year === request.date.year && s.date.month === request.date.month && s.date.day === request.date.day,
      )
      .filter((s) => goe(s.time, request.from))
      .filter((s) => loe(s.time, request.to)),
  );

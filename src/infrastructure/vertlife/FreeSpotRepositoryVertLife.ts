import { BookingRequest } from '../../domain/BookingRequest';
import { FreeSpot, FreeSpotRepository, User } from '../../domain/FreeSpot';
import { formatDate } from '../../domain/JustDate';
import { goe, loe, justTimeFromDate, formatTime } from '../../domain/JustTime';
import { bookRequest } from './VertLifeBookRequest';
import { VertLifeResponse } from './VertLifeResponse';
import { fetchT } from './fetchT';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import * as D from 'io-ts/Decoder';

export class FreeSpotRepositoryVertLife implements FreeSpotRepository {
  constructor(private basePath: string) {}

  get = (request: BookingRequest): TE.TaskEither<Error, FreeSpot[]> => {
    return pipe(
      fetchT(VertLifeResponse, url(this.basePath, request), { method: `GET` }),
      TE.map((response) =>
        response.slots
          .filter((s) => s.free_spots > 0)
          .filter((s) => goe(justTimeFromDate(new Date(s.slot.check_in_at)), request.from))
          .filter((s) => loe(justTimeFromDate(new Date(s.slot.check_in_at)), request.to))
          .flatMap((s) => Array(s.free_spots).fill(s))
          .map((s) => ({
            id: s.def_id,
            date: request.date,
            time: justTimeFromDate(new Date(s.slot.check_in_at)),
          })),
      ),
    );
  };

  book = (freeSpot: FreeSpot, user: User): TE.TaskEither<Error, void> => {
    const url = `${this.basePath}/book`;
    const requestInit = {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=utf-8',
      },
      method: 'POST',
      body: JSON.stringify(bookRequest(freeSpot, user)),
    };

    return pipe(
      fetchT(D.struct({}), url, requestInit),
      TE.map((_) => undefined),
    );
  };
}

const url = (basePath: string, request: BookingRequest): string => {
  const year = formatDate(request.date, `YYYY`);
  const month = formatDate(request.date, `MM`);
  const day = formatDate(request.date, `DD`);
  return `${basePath}/public-slots/at/74/date/${year}/${month}/${day}`;
};

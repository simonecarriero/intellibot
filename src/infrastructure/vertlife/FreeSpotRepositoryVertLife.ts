import { BookingRequest } from '../../domain/BookingRequest';
import { FreeSpot, FreeSpotRepository } from '../../domain/FreeSpot';
import { formatDate } from '../../domain/JustDate';
import { goe, loe, justTimeFromDate } from '../../domain/JustTime';
import { VertLifeResponse } from './VertLifeResponse';
import { fetchT } from './fetchT';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';

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
          .map((s) => ({
            date: request.date,
            time: justTimeFromDate(new Date(s.slot.check_in_at)),
          })),
      ),
    );
  };
}

const url = (basePath: string, request: BookingRequest): string => {
  const year = formatDate(request.date, `YYYY`);
  const month = formatDate(request.date, `MM`);
  const day = formatDate(request.date, `DD`);
  return `${basePath}/date/${year}/${month}/${day}`;
};

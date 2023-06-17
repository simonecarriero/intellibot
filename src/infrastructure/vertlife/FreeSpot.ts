import { BookingRequest } from '../../domain/BookingRequest';
import { formatDate } from '../../domain/JustDate';
import { goe, loe, justTimeFromDate } from '../../domain/JustTime';
import { Ports } from '../../domain/Ports';
import { VertLifeResponse } from './VertLifeResponse';
import { fetchT } from './fetchT';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';

export const curriedGetFreeSpots: (basePath: string) => Ports['getFreeSpots'] = (basePath) => (request) =>
  pipe(
    fetchT(VertLifeResponse, url(basePath, request), { method: `GET` }),
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

const url = (basePath: string, request: BookingRequest): string => {
  const year = formatDate(request.date, `YYYY`);
  const month = formatDate(request.date, `MM`);
  const day = formatDate(request.date, `DD`);
  return `${basePath}/date/${year}/${month}/${day}`;
};

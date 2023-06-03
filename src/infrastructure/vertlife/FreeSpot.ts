import { Ports } from '../../domain/Ports';
import { goe, loe, justTimeFromDate } from '../../domain/JustTime';
import { formatDate } from '../../domain/JustDate';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { BookingRequest } from '../../domain/BookingRequest';

export const curriedGetFreeSpots: (basePath: string) => Ports['getFreeSpots'] = (basePath) => (request) =>
  pipe(
    TE.tryCatch(() => fetch(url(basePath, request), { method: `GET` }), E.toError),
    TE.flatMap((response) => TE.tryCatch(() => response.json(), E.toError)),
    TE.map((json) =>
      json.slots
        .filter((s: any) => s.free_spots > 0)
        .filter((s: any) => goe(justTimeFromDate(new Date(s.slot.check_in_at)), request.from))
        .filter((s: any) => loe(justTimeFromDate(new Date(s.slot.check_in_at)), request.to))
        .map((s: any) => ({
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

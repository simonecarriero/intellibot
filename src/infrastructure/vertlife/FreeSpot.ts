import { BookingRequest } from '../../domain/BookingRequest';
import { formatDate } from '../../domain/JustDate';
import { goe, loe, justTimeFromDate } from '../../domain/JustTime';
import { Ports } from '../../domain/Ports';
import { VertLifeResponse } from './VertLifeResponse';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import * as D from 'io-ts/Decoder';

export const curriedGetFreeSpots: (basePath: string) => Ports['getFreeSpots'] = (basePath) => (request) =>
  pipe(
    TE.tryCatch(() => fetch(url(basePath, request), { method: `GET` }), E.toError),
    TE.flatMap((response) => TE.tryCatch(() => response.json(), E.toError)),
    TE.flatMapEither((response) =>
      pipe(
        response,
        VertLifeResponse.decode,
        E.mapLeft((errors) => new Error(`Response decoding failed:\n${D.draw(errors)}`)),
      ),
    ),
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

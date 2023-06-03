import { FreeSpot } from '../domain/FreeSpot';
import { Ports } from '../domain/Ports';
import * as A from 'fp-ts/Array';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';

export type CheckBookingRequests = () => TE.TaskEither<Error, FreeSpot[]>;

export const curriedCheckBookingRequests =
  (ports: Pick<Ports, 'getBookingRequests' | 'getFreeSpots'>): CheckBookingRequests =>
  () =>
    pipe(
      ports.getBookingRequests(),
      TE.flatMap((requests) => pipe(requests, A.traverse(TE.ApplicativePar)(ports.getFreeSpots), TE.map(A.flatten))),
    );

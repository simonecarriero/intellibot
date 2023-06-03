import { JustTime } from './JustTime';
import { JustDate } from './JustDate';
import { BookingRequest } from './BookingRequest';
import * as TE from 'fp-ts/lib/TaskEither';

export type FreeSpot = {
  date: JustDate;
  time: JustTime;
};

export type GetFreeSpots = (request: BookingRequest) => TE.TaskEither<Error, FreeSpot[]>;

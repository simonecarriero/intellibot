import { BookingRequest } from './BookingRequest';
import { JustDate } from './JustDate';
import { JustTime } from './JustTime';
import * as TE from 'fp-ts/lib/TaskEither';

export type FreeSpot = {
  date: JustDate;
  time: JustTime;
};

export interface FreeSpotRepository {
  get(request: BookingRequest): TE.TaskEither<Error, FreeSpot[]>;
  book(spot: FreeSpot): TE.TaskEither<Error, void>;
}

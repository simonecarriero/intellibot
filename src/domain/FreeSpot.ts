import { BookingRequest } from './BookingRequest';
import { JustDate } from './JustDate';
import { JustTime } from './JustTime';
import * as TE from 'fp-ts/lib/TaskEither';

export type FreeSpot = {
  id: number;
  date: JustDate;
  time: JustTime;
  user?: User;
};

export type User = {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
};

export interface FreeSpotRepository {
  get(request: BookingRequest): TE.TaskEither<Error, FreeSpot[]>;
  book(spot: FreeSpot, user: User): TE.TaskEither<Error, void>;
}

import { JustTime } from './JustTime';
import { JustDate } from './JustDate';
import * as TE from 'fp-ts/lib/TaskEither';

export type BookingRequest = {
  date: JustDate;
  from: JustTime;
  to: JustTime;
};

export type AddBookingRequest = (request: BookingRequest) => TE.TaskEither<Error, void>;

export type GetBookingRequests = () => TE.TaskEither<Error, BookingRequest[]>;

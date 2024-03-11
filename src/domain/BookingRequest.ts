import { JustDate } from './JustDate';
import { JustTime } from './JustTime';
import * as TE from 'fp-ts/lib/TaskEither';

export type BookingRequest = {
  date: JustDate;
  from: JustTime;
  to: JustTime;
  chat: number;
  user?: string;
};

export interface BookingRequestRepository {
  add(request: BookingRequest): TE.TaskEither<Error, void>;
  delete(request: BookingRequest): TE.TaskEither<Error, void>;
  get(): TE.TaskEither<Error, BookingRequest[]>;
}

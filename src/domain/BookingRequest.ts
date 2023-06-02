import { JustTime } from './JustTime';
import { JustDate } from './JustDate';

export type BookingRequest = {
  date: JustDate;
  from: JustTime;
  to: JustTime;
};

export type AddBookingRequest = (request: BookingRequest) => Promise<void>;

export type GetBookingRequests = () => Promise<BookingRequest[]>;

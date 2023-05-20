export type BookingRequest = {
  date: string;
  from: string;
  to: string;
};

export type AddBookingRequest = (request: BookingRequest) => Promise<void>;

export type GetBookingRequests = () => Promise<BookingRequest[]>;

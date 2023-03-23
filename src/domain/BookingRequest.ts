export type BookingRequest = {
  date: string;
  from: string;
  to: string;
};

export type AddBookingRequest = (request: BookingRequest) => void;

export type GetBookingRequests = () => BookingRequest[];

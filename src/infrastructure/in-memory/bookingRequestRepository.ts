import { AddBookingRequest, BookingRequest, GetBookingRequests } from '../../domain/BookingRequest';

const add: (state: BookingRequest[]) => AddBookingRequest =
  (state) =>
  (request): void => {
    state.push(request);
  };

const get: (state: BookingRequest[]) => GetBookingRequests = (state) => () => state;

export const bookingRequestRepository = (state: BookingRequest[] = []) => {
  return {
    add: add(state),
    get: get(state),
  };
};

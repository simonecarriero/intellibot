import { AddBookingRequest, BookingRequest, GetBookingRequests } from '../../domain/BookingRequest';

const add: (state: BookingRequest[]) => AddBookingRequest =
  (state) =>
  (request): Promise<void> => {
    state.push(request);
    return Promise.resolve();
  };

const get: (state: BookingRequest[]) => GetBookingRequests = (state) => () => Promise.resolve(state);

export const bookingRequestRepository = (state: BookingRequest[] = []) => {
  return {
    add: add(state),
    get: get(state),
  };
};

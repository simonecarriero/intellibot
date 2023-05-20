import { BookingRequest } from '../../domain/BookingRequest';
import { Ports } from '../../domain/Ports';

export const curriedAddBookingRequest: (state: BookingRequest[]) => Ports['addBookingRequest'] =
  (state) =>
  (request): Promise<void> => {
    state.push(request);
    return Promise.resolve();
  };

export const curriedGetBookingRequests: (state: BookingRequest[]) => Ports['getBookingRequests'] = (state) => () =>
  Promise.resolve(state);

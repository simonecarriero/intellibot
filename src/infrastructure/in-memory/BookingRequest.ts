import { BookingRequest } from '../../domain/BookingRequest';
import { Ports } from '../../domain/Ports';
import * as TE from 'fp-ts/TaskEither';

export const curriedAddBookingRequest: (state: BookingRequest[]) => Ports['addBookingRequest'] =
  (state) => (request) => {
    state.push(request);
    return TE.of(undefined);
  };

export const curriedGetBookingRequests: (state: BookingRequest[]) => Ports['getBookingRequests'] = (state) => () =>
  TE.of(state);

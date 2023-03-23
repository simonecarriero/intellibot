import { getPendingBookingRequests as buildGetPendingBookingRequests } from './getPendingBookingRequests';
import { requestBooking as buildRequestBooking } from './requestBooking';
import { bookingRequestRepository as buildBookingRequestRepository } from '../infrastructure/in-memory/bookingRequestRepository';

describe(`Application`, () => {
  it(`should book request and get pending requests`, () => {
    const bookingRequestRepository = buildBookingRequestRepository();
    const requestBooking = buildRequestBooking(bookingRequestRepository.add);
    const getPendingBookingRequests = buildGetPendingBookingRequests(bookingRequestRepository.get);

    const bookingRequest = {
      date: `2023-03-24`,
      from: `18:00`,
      to: `20:00`,
    };
    requestBooking(bookingRequest);

    const requests = getPendingBookingRequests();

    expect(requests).toEqual([
      {
        date: `2023-03-24`,
        from: `18:00`,
        to: `20:00`,
      },
    ]);
  });
});

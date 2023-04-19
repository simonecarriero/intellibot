import { getPendingBookingRequests as buildGetPendingBookingRequests } from './getPendingBookingRequests';
import { requestBooking as buildRequestBooking } from './requestBooking';
import { checkBookingRequests as buildCheckBookingRequests } from './checkBookingRequests';
import { bookingRequestRepository as buildBookingRequestRepository } from '../infrastructure/in-memory/bookingRequestRepository';
import { freeSpotsRepository as buildFreeSpotsRepository } from '../infrastructure/in-memory/freeSpotsRepository';

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

  it(`should return the free spots for the booking requests`, () => {
    let freeSpots = [
      { date: `2019-12-31`, time: `18:00` },
      { date: `2020-01-01`, time: `17:30` },
      { date: `2020-01-01`, time: `18:30` },
      { date: `2020-01-01`, time: `19:30` },
      { date: `2020-01-01`, time: `20:30` },
    ];
    let bookingRequests = [
      { date: `2020-01-01`, from: `18:00`, to: `19:00` },
      { date: `2020-01-01`, from: `20:00`, to: `21:00` },
    ];

    const bookingRequestRepository = buildBookingRequestRepository(bookingRequests);

    const freeSpotsRepository = buildFreeSpotsRepository(freeSpots);

    const checkBookingRequests = buildCheckBookingRequests(bookingRequestRepository.get, freeSpotsRepository.get);

    const response = checkBookingRequests();

    expect(response).toEqual([
      { date: `2020-01-01`, time: `18:30` },
      { date: `2020-01-01`, time: `20:30` },
    ]);
  });
});

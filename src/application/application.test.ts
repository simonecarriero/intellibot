import { curriedGetPendingBookingRequests } from './getPendingBookingRequests';
import { curriedRequestBooking } from './requestBooking';
import { curriedCheckBookingRequests as buildCheckBookingRequests } from './checkBookingRequests';
import { curriedAddBookingRequest, curriedGetBookingRequests } from '../infrastructure/in-memory/BookingRequest';
import { curriedGetFreeSpots } from '../infrastructure/in-memory/FreeSpot';
import { BookingRequest } from '../domain/BookingRequest';
import { FreeSpot } from '../domain/FreeSpot';

describe(`Application`, () => {
  it(`should book request and get pending requests`, async () => {
    const ports = testPorts();
    const requestBooking = curriedRequestBooking(ports);
    const getPendingBookingRequests = curriedGetPendingBookingRequests(ports);

    const bookingRequest = {
      date: `2023-03-24`,
      from: `18:00`,
      to: `20:00`,
    };
    await requestBooking(bookingRequest);

    const requests = await getPendingBookingRequests();

    expect(requests).toEqual([
      {
        date: `2023-03-24`,
        from: `18:00`,
        to: `20:00`,
      },
    ]);
  });

  it(`should return the free spots for the booking requests`, async () => {
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

    const ports = testPorts(bookingRequests, freeSpots);
    const checkBookingRequests = buildCheckBookingRequests(ports);

    const response = await checkBookingRequests();

    expect(response).toEqual([
      { date: `2020-01-01`, time: `18:30` },
      { date: `2020-01-01`, time: `20:30` },
    ]);
  });
});

const testPorts = (bookingRequests: BookingRequest[] = [], freeSpots: FreeSpot[] = []) => {
  return {
    addBookingRequest: curriedAddBookingRequest(bookingRequests),
    getBookingRequests: curriedGetBookingRequests(bookingRequests),
    getFreeSpots: curriedGetFreeSpots(freeSpots),
  };
};

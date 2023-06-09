import { BookingRequest } from '../domain/BookingRequest';
import { FreeSpot } from '../domain/FreeSpot';
import { justDate } from '../domain/JustDate';
import { justTime } from '../domain/JustTime';
import { curriedAddBookingRequest, curriedGetBookingRequests } from '../infrastructure/in-memory/BookingRequest';
import { curriedGetFreeSpots } from '../infrastructure/in-memory/FreeSpot';
import { curriedCheckBookingRequests as buildCheckBookingRequests } from './checkBookingRequests';
import { curriedGetPendingBookingRequests } from './getPendingBookingRequests';
import { curriedRequestBooking } from './requestBooking';
import * as E from 'fp-ts/Either';

describe(`Application`, () => {
  it(`should book request and get pending requests`, async () => {
    const ports = testPorts();
    const requestBooking = curriedRequestBooking(ports);
    const getPendingBookingRequests = curriedGetPendingBookingRequests(ports);

    const bookingRequest = {
      date: justDate(2023, 3, 24),
      from: justTime(18),
      to: justTime(20),
    };
    await requestBooking(bookingRequest);

    const requests = getPendingBookingRequests();

    expect(requests()).resolves.toEqual(
      E.right([
        {
          date: justDate(2023, 3, 24),
          from: justTime(18),
          to: justTime(20),
        },
      ]),
    );
  });

  it(`should return the free spots for the booking requests`, async () => {
    let freeSpots = [
      { date: justDate(2019, 12, 31), time: justTime(18) },
      { date: justDate(2020, 1, 1), time: justTime(17, 30) },
      { date: justDate(2020, 1, 1), time: justTime(18, 30) },
      { date: justDate(2020, 1, 1), time: justTime(19, 30) },
      { date: justDate(2020, 1, 1), time: justTime(20, 30) },
    ];
    let bookingRequests = [
      { date: justDate(2020, 1, 1), from: justTime(18), to: justTime(19) },
      { date: justDate(2020, 1, 1), from: justTime(20), to: justTime(21) },
    ];

    const ports = testPorts(bookingRequests, freeSpots);
    const checkBookingRequests = buildCheckBookingRequests(ports);

    const response = checkBookingRequests();

    expect(response()).resolves.toEqual(
      E.right([
        { date: justDate(2020, 1, 1), time: justTime(18, 30) },
        { date: justDate(2020, 1, 1), time: justTime(20, 30) },
      ]),
    );
  });
});

const testPorts = (bookingRequests: BookingRequest[] = [], freeSpots: FreeSpot[] = []) => {
  return {
    addBookingRequest: curriedAddBookingRequest(bookingRequests),
    getBookingRequests: curriedGetBookingRequests(bookingRequests),
    getFreeSpots: curriedGetFreeSpots(freeSpots),
  };
};

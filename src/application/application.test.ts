import { justDate } from '../domain/JustDate';
import { justTime } from '../domain/JustTime';
import { BookingRequestRepositoryInMemory } from '../infrastructure/in-memory/BookingRequestRepositoryInMemory';
import { FreeSpotRepositoryInMemory } from '../infrastructure/in-memory/FreeSpotRepositoryInMemory';
import { checkBookingRequests } from './checkBookingRequests';
import { getPendingBookingRequests } from './getPendingBookingRequests';
import { requestBooking } from './requestBooking';
import * as E from 'fp-ts/Either';

describe(`Application`, () => {
  it(`should book request and get pending requests`, async () => {
    const bookingRequestRepository = new BookingRequestRepositoryInMemory();
    const requestBookingUseCase = requestBooking(bookingRequestRepository);
    const getPendingBookingRequestsUseCase = getPendingBookingRequests(bookingRequestRepository);

    const bookingRequest = {
      date: justDate(2023, 3, 24),
      from: justTime(18),
      to: justTime(20),
    };
    await requestBookingUseCase(bookingRequest);

    const requests = getPendingBookingRequestsUseCase();

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

    const freeSpotRepository = new FreeSpotRepositoryInMemory(freeSpots);
    const bookingRequestRepository = new BookingRequestRepositoryInMemory(bookingRequests);
    const checkBookingRequestsUseCase = checkBookingRequests(bookingRequestRepository, freeSpotRepository);

    expect(checkBookingRequestsUseCase()).resolves.toEqual(
      E.right([
        { date: justDate(2020, 1, 1), time: justTime(18, 30) },
        { date: justDate(2020, 1, 1), time: justTime(20, 30) },
      ]),
    );
  });
});

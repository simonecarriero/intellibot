import { justDate } from '../domain/JustDate';
import { justTime } from '../domain/JustTime';
import { BookingRequestRepositoryInMemory } from '../infrastructure/in-memory/BookingRequestRepositoryInMemory';
import { FreeSpotRepositoryInMemory } from '../infrastructure/in-memory/FreeSpotRepositoryInMemory';
import { UserRepositoryInMemory } from '../infrastructure/in-memory/UserRepositoryInMemory';
import { book } from './book';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';

describe(`book`, () => {
  const jane = {
    firstname: 'Jane',
    lastname: 'Doe',
    email: 'jane.doe@example.com',
    phone: '0123456789',
  };

  const jon = {
    firstname: 'Jon',
    lastname: 'Doe',
    email: 'jon.doe@example.com',
    phone: '0123456789',
  };

  const userRepository = new UserRepositoryInMemory([jane, jon]);

  it(`books the first available spot for each booking request`, async () => {
    let freeSpots = [
      { id: 1, date: justDate(2020, 1, 1), time: justTime(18, 30) },
      { id: 1, date: justDate(2020, 1, 1), time: justTime(19, 30) },
      { id: 1, date: justDate(2020, 1, 1), time: justTime(19, 30) },
    ];
    let bookingRequests = [
      { date: justDate(2020, 1, 1), from: justTime(18), to: justTime(20), chat: 123 },
      { date: justDate(2020, 1, 1), from: justTime(18), to: justTime(21), chat: 123 },
    ];

    const freeSpotRepository = new FreeSpotRepositoryInMemory(freeSpots);
    const bookingRequestRepository = new BookingRequestRepositoryInMemory(bookingRequests);
    const bookUseCase = book(bookingRequestRepository, freeSpotRepository, userRepository);

    const booked = await bookUseCase();

    expect(booked).toEqual(
      E.right([
        [
          { date: justDate(2020, 1, 1), from: justTime(18), to: justTime(20), chat: 123 },
          { id: 1, date: justDate(2020, 1, 1), time: justTime(18, 30), user: jane },
        ],
        [
          { date: justDate(2020, 1, 1), from: justTime(18), to: justTime(21), chat: 123 },
          { id: 1, date: justDate(2020, 1, 1), time: justTime(19, 30), user: jane },
        ],
      ]),
    );

    const spots = freeSpotRepository.get({
      date: justDate(2020, 1, 1),
      from: justTime(1),
      to: justTime(23, 59),
      chat: 123,
    });
    expect(spots()).resolves.toEqual(E.right([{ id: 1, date: justDate(2020, 1, 1), time: justTime(19, 30) }]));
  });

  it(`removes the request when the booking is successful`, async () => {
    let freeSpots = [
      { id: 1, date: justDate(2020, 1, 1), time: justTime(18, 30) },
      { id: 1, date: justDate(2020, 1, 1), time: justTime(19, 30) },
    ];
    let bookingRequests = [{ date: justDate(2020, 1, 1), from: justTime(19), to: justTime(20), chat: 123 }];

    const freeSpotRepository = new FreeSpotRepositoryInMemory(freeSpots);
    const bookingRequestRepository = new BookingRequestRepositoryInMemory(bookingRequests);
    const bookUseCase = book(bookingRequestRepository, freeSpotRepository, userRepository);

    await bookUseCase();

    const requests = bookingRequestRepository.get();
    expect(requests()).resolves.toEqual(E.right([]));
  });

  it(`skips a request if there are no spots available for it`, async () => {
    let freeSpots = [{ id: 1, date: justDate(2020, 1, 1), time: justTime(20, 30) }];
    let bookingRequests = [
      { date: justDate(2020, 1, 1), from: justTime(18), to: justTime(20), chat: 123 },
      { date: justDate(2020, 1, 1), from: justTime(19), to: justTime(21), chat: 123 },
    ];

    const freeSpotRepository = new FreeSpotRepositoryInMemory(freeSpots);
    const bookingRequestRepository = new BookingRequestRepositoryInMemory(bookingRequests);
    const bookUseCase = book(bookingRequestRepository, freeSpotRepository, userRepository);
    await bookUseCase();

    const spots = freeSpotRepository.get({
      date: justDate(2020, 1, 1),
      from: justTime(1),
      to: justTime(23, 59),
      chat: 123,
    });

    expect(spots()).resolves.toEqual(E.right([]));
  });

  it(`gets user`, async () => {
    let freeSpots = [{ id: 1, date: justDate(2020, 1, 1), time: justTime(18, 30) }];
    let bookingRequests = [
      { date: justDate(2020, 1, 1), from: justTime(18), to: justTime(20), chat: 123, user: 'Jon' },
    ];

    const freeSpotRepository = new FreeSpotRepositoryInMemory(freeSpots);
    const bookingRequestRepository = new BookingRequestRepositoryInMemory(bookingRequests);
    const bookUseCase = book(bookingRequestRepository, freeSpotRepository, userRepository);

    const booked = await pipe(
      bookUseCase,
      TE.map(([[_, freeSpot]]) => freeSpot),
    )();

    expect(booked).toEqual(
      E.right({
        id: 1,
        date: justDate(2020, 1, 1),
        time: justTime(18, 30),
        user: jon,
      }),
    );
  });
});

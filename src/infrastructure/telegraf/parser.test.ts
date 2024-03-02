import { BookingRequest } from '../../domain/BookingRequest';
import { User } from '../../domain/FreeSpot';
import { justDate } from '../../domain/JustDate';
import { justTime } from '../../domain/JustTime';
import { parse } from './parser';

describe(`parser`, () => {
  it(`parses weekday and time range`, async () => {
    const now = () => justDate(2024, 3, 1);
    const requests = parse('/book monday 18:45 - 20', now);

    expect(requests).toEqual([{ date: justDate(2024, 3, 4), from: justTime(18, 45), to: justTime(20), chat: 123 }]);
  });
});

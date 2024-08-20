import { justDate } from '../../domain/JustDate';
import { justTime } from '../../domain/JustTime';
import { parse } from './parser';

describe(`parser`, () => {
  it(`parses weekday and time range`, async () => {
    const now = () => justDate(2024, 3, 1);
    const requests = parse('/book monday 18:45 - 20', now);

    expect(requests).toEqual([
      expect.objectContaining({ date: justDate(2024, 3, 4), from: justTime(18, 45), to: justTime(20) }),
    ]);
  });

  it(`parses missing day as today`, async () => {
    const now = () => justDate(2024, 3, 1);
    const requests = parse('/book 18:45 - 20', now);

    expect(requests).toEqual([
      expect.objectContaining({ date: justDate(2024, 3, 1), from: justTime(18, 45), to: justTime(20) }),
    ]);
  });

  it(`parses missing time range as 18 to 20`, async () => {
    const now = () => justDate(2024, 3, 1);
    const requests = parse('/book today', now);

    expect(requests).toEqual([
      expect.objectContaining({ date: justDate(2024, 3, 1), from: justTime(18), to: justTime(20) }),
    ]);
  });

  it(`parses missing day and missing time range as today 18 to 20`, async () => {
    const now = () => justDate(2024, 3, 1);
    const requests = parse('/book', now);

    expect(requests).toEqual([
      expect.objectContaining({ date: justDate(2024, 3, 1), from: justTime(18), to: justTime(20) }),
    ]);
  });

  it(`parses a single time defaulting the end of the range to +2 hours`, async () => {
    const now = () => justDate(2024, 3, 1);
    const requests = parse('/book today 18', now);

    expect(requests).toEqual([
      expect.objectContaining({ date: justDate(2024, 3, 1), from: justTime(18), to: justTime(20) }),
    ]);
  });

  it(`parses multiple dates and time ranges`, async () => {
    const now = () => justDate(2024, 3, 1);
    const requests = parse('/book today 18 - 19 and tomorrow 19 - 20', now);

    expect(requests).toEqual([
      expect.objectContaining({ date: justDate(2024, 3, 1), from: justTime(18), to: justTime(19) }),
      expect.objectContaining({ date: justDate(2024, 3, 2), from: justTime(19), to: justTime(20) }),
    ]);
  });

  it(`returns the given chat id`, async () => {
    const chatId = 42;
    const requests = parse('/book', () => justDate(2024, 1, 1), chatId);

    expect(requests).toEqual([expect.objectContaining({ chat: chatId })]);
  });

  it(`returns the given chat id booking`, async () => {
    const chatId = 42;
    const requests = parse('/book today 18', () => justDate(2024, 1, 1), chatId);

    expect(requests).toEqual([expect.objectContaining({ chat: chatId })]);
  });

  it(`parses just the user`, async () => {
    const now = () => justDate(2024, 3, 1);
    const requests = parse('/book for Jane', now);

    expect(requests).toEqual([expect.objectContaining({ user: 'Jane' })]);
  });

  it(`parses for all users if no user is present`, async () => {
    const now = () => justDate(2024, 3, 1);
    const requests = parse('/book', now, 123, ['Jane', 'Joe']);

    expect(requests).toEqual([expect.objectContaining({ user: 'Jane' }), expect.objectContaining({ user: 'Joe' })]);
  });

  it(`parses a time range and the user`, async () => {
    const now = () => justDate(2024, 3, 1);
    const requests = parse('/book today for Jane', now);

    expect(requests).toEqual([expect.objectContaining({ user: 'Jane' })]);
  });

  it.each([{ separator: ' ' }, { separator: ',' }, { separator: '  ,,  ' }])(
    `parses multiple users splitting by '$separator'`,
    async ({ separator: s }) => {
      const now = () => justDate(2024, 3, 1);
      const requests = parse(`/book today for Jane${s}Joe`, now);

      expect(requests).toEqual([expect.objectContaining({ user: 'Jane' }), expect.objectContaining({ user: 'Joe' })]);
    },
  );
});

import { BookingRequest } from '../../domain/BookingRequest';
import { JustDate, formatDate, justDate } from '../../domain/JustDate';
import { justTime } from '../../domain/JustTime';
import * as chrono from 'chrono-node';

export const parse = (input: string, now: () => JustDate): BookingRequest[] => {
  const results = chrono.parse(input, new Date(formatDate(now())), { forwardDate: true });

  if (results.length < 1) {
    return [{ date: now(), from: justTime(18), to: justTime(20), chat: 123 }];
  }

  return results.map((result) => {
    const year = result.start.get('year') || now().year;
    const month = result.start.get('month') || now().month;
    const day = result.start.get('day') || now().day;

    const fromHour = result.start.isCertain('hour') ? result.start.get('hour')! : 18;
    const fromMinute = result.start.isCertain('minute') ? result.start.get('minute')! : 0;

    const toHour = result.end?.get('hour') || fromHour + 2;
    const toMinute = result.end?.get('minute') || 0;

    return {
      date: justDate(year, month, day),
      from: justTime(fromHour, fromMinute),
      to: justTime(toHour, toMinute),
      chat: 123,
    };
  });
};

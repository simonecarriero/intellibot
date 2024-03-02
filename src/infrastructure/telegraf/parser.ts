import { BookingRequest } from '../../domain/BookingRequest';
import { JustDate, formatDate, justDate } from '../../domain/JustDate';
import { justTime } from '../../domain/JustTime';
import * as chrono from 'chrono-node';

export const parse = (input: string, now: () => JustDate): BookingRequest[] => {
  const results = chrono.parse(input, new Date(formatDate(now())), { forwardDate: true });
  const result = results[0];

  const date = justDate(result.start.get('year')!, result.start.get('month')!, result.start.get('day')!);
  const from = justTime(result.start.get('hour')!, result.start.get('minute')!);
  const to = justTime(result.end?.get('hour')!, result.end?.get('minute')!);

  return [{ date, from, to, chat: 123 }];
};

import { UseCases } from '../../application/UseCases';
import { BookingRequest } from '../../domain/BookingRequest';
import { formatDate, justToday } from '../../domain/JustDate';
import { formatTime, justTime } from '../../domain/JustTime';
import * as A from 'fp-ts/Array';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Telegraf } from 'telegraf';

export const curriedBot = (
  botToken: string,
  useCases: Pick<UseCases, 'requestBooking' | 'getPendingBookingRequests'>,
) => {
  const bot = new Telegraf(botToken, { telegram: { webhookReply: true } });

  bot.command('monitor', async (ctx) => {
    const request = { date: justToday(), from: justTime(18), to: justTime(20) };
    pipe(
      useCases.requestBooking(request),
      TE.matchW(
        (e) => console.error(e),
        (_) => ctx.reply(monitoringMessage(request)),
      ),
    )();
  });

  bot.command('status', async (ctx) => {
    pipe(
      useCases.getPendingBookingRequests(),
      TE.matchW(
        (e) => console.error(e),
        A.map((request) => ctx.reply(monitoringMessage(request))),
      ),
    )();
  });

  return bot;
};

const monitoringMessage = (request: BookingRequest): string =>
  `monitoring for ${formatDate(request.date)} ${formatTime(request.from)} - ${formatTime(request.to)}`;

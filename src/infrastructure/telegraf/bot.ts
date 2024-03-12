import { book } from '../../application/book';
import { BookingRequest, BookingRequestRepository } from '../../domain/BookingRequest';
import { FreeSpotRepository } from '../../domain/FreeSpot';
import { formatDate, justToday } from '../../domain/JustDate';
import { formatTime, justTime } from '../../domain/JustTime';
import { UserRepository } from '../../domain/User';
import Cron from 'croner';
import * as A from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { Telegraf } from 'telegraf';

export const telegrafBot = (
  botToken: string,
  bookingRequestRepository: BookingRequestRepository,
  freeSpotRepository: FreeSpotRepository,
  userRepository: UserRepository,
) => {
  const bot = new Telegraf(botToken, { telegram: { webhookReply: true } });

  bot.command('monitor', async (ctx) => {
    const chat = await ctx.getChat();
    const request = { date: justToday(), from: justTime(18), to: justTime(20), chat: chat.id };
    pipe(
      bookingRequestRepository.add(request),
      TE.flatMap((_) => bookingRequestRepository.get()),
      TE.matchW(
        (e) => console.error(e),
        (_) => ctx.reply(monitoringMessage(request)),
      ),
    )();
  });

  bot.command('status', async (ctx) => {
    pipe(
      bookingRequestRepository.get(),
      TE.matchW(
        (e) => console.error(e),
        A.map((request) => ctx.reply(monitoringMessage(request))),
      ),
    )();
  });

  Cron('* * * * *', () =>
    pipe(
      book(bookingRequestRepository, freeSpotRepository, userRepository),
      TE.matchW(
        (e) => console.error(e),
        A.map(([bookedRequest, bookedSpot]) => {
          return bot.telegram.sendMessage(
            bookedRequest.chat,
            `booked for ${formatDate(bookedSpot.date)} at ${formatTime(bookedSpot.time)}`,
          );
        }),
      ),
    )(),
  );

  return bot;
};

const monitoringMessage = (request: BookingRequest): string =>
  `monitoring for ${formatDate(request.date)} ${formatTime(request.from)} - ${formatTime(request.to)}`;

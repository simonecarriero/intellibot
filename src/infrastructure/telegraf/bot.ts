import { Telegraf } from 'telegraf';
import { UseCases } from '../../application/UseCases';
import { formatTime, justTime } from '../../domain/JustTime';
import { formatDate, justToday } from '../../domain/JustDate';

export const curriedBot = (
  botToken: string,
  useCases: Pick<UseCases, 'requestBooking' | 'getPendingBookingRequests'>,
) => {
  const bot = new Telegraf(botToken, { telegram: { webhookReply: true } });

  bot.command('monitor', async (ctx) => {
    const request = { date: justToday(), from: justTime(18), to: justTime(20) };
    await useCases.requestBooking(request);
    ctx.reply(`monitoring for ${formatDate(request.date)} ${formatTime(request.from)} - ${formatTime(request.to)}`);
  });

  bot.command('status', async (ctx) => {
    const requests = await useCases.getPendingBookingRequests();
    requests.forEach((request) =>
      ctx.reply(`monitoring for ${formatDate(request.date)} ${formatTime(request.from)} - ${formatTime(request.to)}`),
    );
  });

  return bot;
};

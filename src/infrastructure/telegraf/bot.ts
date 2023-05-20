import { Telegraf } from 'telegraf';
import { UseCases } from '../../application/UseCases';

export const curriedBot = (
  botToken: string,
  useCases: Pick<UseCases, 'requestBooking' | 'getPendingBookingRequests'>,
) => {
  const bot = new Telegraf(botToken, { telegram: { webhookReply: true } });

  bot.command('monitor', async (ctx) => {
    const request = { date: new Date().toISOString().split('T')[0], from: '18:00', to: '20:00' };
    await useCases.requestBooking(request);
    ctx.reply(`monitoring for ${request.date} ${request.from} - ${request.to}`);
  });

  bot.command('status', async (ctx) => {
    const requests = await useCases.getPendingBookingRequests();
    requests.forEach((request) => ctx.reply(`monitoring for ${request.date} ${request.from} - ${request.to}`));
  });

  return bot;
};

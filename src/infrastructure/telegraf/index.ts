import { Telegraf } from 'telegraf';
import { curriedRequestBooking } from '../../application/requestBooking';
import { curriedGetPendingBookingRequests } from '../../application/getPendingBookingRequests';
import { curriedAddBookingRequest, curriedGetBookingRequests } from '../aws/dynamo/BookingRequest';

const tableName = process.env.DYNAMODB_TABLE_NAME!;
const ports = {
  addBookingRequest: curriedAddBookingRequest(tableName),
  getBookingRequests: curriedGetBookingRequests(tableName),
};
const requestBooking = curriedRequestBooking(ports);
const getPendingBookingRequests = curriedGetPendingBookingRequests(ports);

const bot = new Telegraf(process.env.BOT_TOKEN!, { telegram: { webhookReply: true } });

bot.command('monitor', async (ctx) => {
  const request = { date: new Date().toISOString().split('T')[0], from: '18:00', to: '20:00' };
  await requestBooking(request);
  ctx.reply(`monitoring for ${request.date} ${request.from} - ${request.to}`);
});

bot.command('status', async (ctx) => {
  const requests = await getPendingBookingRequests();
  requests.forEach((request) => ctx.reply(`monitoring for ${request.date} ${request.from} - ${request.to}`));
});

export const handler = async (event: any, context: any, callback: any) => {
  await bot.handleUpdate(JSON.parse(event.body));
  return await callback(null, { statusCode: 200, body: '' });
};

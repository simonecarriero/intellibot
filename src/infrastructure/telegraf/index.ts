import { Telegraf } from 'telegraf';
import { requestBooking as buildRequestBooking } from '../../application/requestBooking';
import { getPendingBookingRequests as buildGetPendingBookingRequests } from '../../application/getPendingBookingRequests';
import { addBookingRequest, getBookingRequests } from '../aws/dynamo/BookingRequest';

const tableName = process.env.DYNAMODB_TABLE_NAME!;
const requestBooking = buildRequestBooking(addBookingRequest(tableName));
const getPendingBookingRequests = buildGetPendingBookingRequests(getBookingRequests(tableName));

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

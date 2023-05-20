import { curriedRequestBooking } from '../application/requestBooking';
import { curriedGetPendingBookingRequests } from '../application/getPendingBookingRequests';
import { curriedAddBookingRequest, curriedGetBookingRequests } from './aws/dynamo/BookingRequest';
import { curriedBot } from './telegraf/bot';

const tableName = process.env.DYNAMODB_TABLE_NAME!;

const ports = {
  addBookingRequest: curriedAddBookingRequest(tableName),
  getBookingRequests: curriedGetBookingRequests(tableName),
};

const useCases = {
  requestBooking: curriedRequestBooking(ports),
  getPendingBookingRequests: curriedGetPendingBookingRequests(ports),
};

const bot = curriedBot(process.env.BOT_TOKEN!, useCases);

export const handler = async (event: any, context: any, callback: any) => {
  await bot.handleUpdate(JSON.parse(event.body));
  return await callback(null, { statusCode: 200, body: '' });
};

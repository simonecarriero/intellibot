import { getPendingBookingRequests } from '../application/getPendingBookingRequests';
import { BookingRequestRepositoryDynamo } from './aws/dynamo/BookingRequestRepositoryDynamo';
import { telegrafBot } from './telegraf/bot';

const tableName = process.env.DYNAMODB_TABLE_NAME!;

const bookingRequestRepository = new BookingRequestRepositoryDynamo(tableName);

const getPendingBookingRequestsUseCase = getPendingBookingRequests(bookingRequestRepository);

const bot = telegrafBot(process.env.BOT_TOKEN!, getPendingBookingRequestsUseCase);

export const handler = async (event: any, context: any, callback: any) => {
  await bot.handleUpdate(JSON.parse(event.body));
  return await callback(null, { statusCode: 200, body: '' });
};

import { BookingRequestRepositoryInMemory } from './in-memory/BookingRequestRepositoryInMemory';
import { telegrafBot } from './telegraf/bot';
import { FreeSpotRepositoryVertLife } from './vertlife/FreeSpotRepositoryVertLife';
import * as http from 'http';

const bookingRequestRepository = new BookingRequestRepositoryInMemory();
const freeSpotRepository = new FreeSpotRepositoryVertLife(process.env.API_BASE_PATH!);
const bot = telegrafBot(process.env.BOT_TOKEN!, bookingRequestRepository, freeSpotRepository);

(async () => {
  http
    .createServer(async (request, response) => {
      let chunks: any = [];
      request
        .on('error', (e) => console.error(e))
        .on('data', (chunk) => chunks.push(chunk))
        .on('end', async () => {
          const body = JSON.parse(Buffer.concat(chunks).toString());
          await bot.handleUpdate(body);
          response.writeHead(200, { 'Content-Type': 'application/json' });
          response.end();
        });
    })
    .listen(8080);
})();

import { telegramClient, todayDate } from './testUtils';

let telegram!: Awaited<ReturnType<typeof telegramClient>>;

beforeAll(async () => {
  telegram = await telegramClient();
});

afterAll(async () => {
  await telegram.close();
});

describe('Bot', () => {
  it('should handle booking requests', async () => {
    await telegram.sendMessage('/monitor for Jane');
    await telegram.expectMessages([`monitoring ${todayDate()} 18:00 - 20:00 for Jane`]);

    await telegram.sendMessage('/status');
    await telegram.expectMessages([`monitoring ${todayDate()} 18:00 - 20:00 for Jane`]);
  }, 90000);
});

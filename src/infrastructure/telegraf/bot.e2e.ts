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
    await telegram.sendMessage('/monitor');
    await telegram.expectMessages([`monitoring for ${todayDate()} 18:00 - 20:00`]);

    await telegram.sendMessage('/status');
    await telegram.expectMessages([`monitoring for ${todayDate()} 18:00 - 20:00`]);
  }, 90000);
});

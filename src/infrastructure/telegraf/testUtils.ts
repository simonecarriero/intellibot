import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

export const telegramClient = async () => {
  const session = process.env.TELEGRAM_SESSION!;
  const apiId = parseInt(process.env.TELEGRAM_API_ID!);
  const apiHash = process.env.TELEGRAM_API_HASH!;
  const testGroupId = process.env.TELEGRAM_TEST_GROUP_ID!;
  const client = new TelegramClient(new StringSession(session), apiId, apiHash, {});
  await client.connect();

  const retry = buildRetry(10000, 500);

  return {
    sendMessage: async (message: string): Promise<void> => {
      await client.sendMessage(testGroupId, { message });
    },
    expectMessages: async (expectedMessages: string[]): Promise<void> => {
      await retry(async () => {
        const [...response] = await client.getMessages(testGroupId, { limit: expectedMessages.length });
        const lastMessages = response.map((m) => m.message);
        expect(lastMessages).toEqual(expectedMessages);
      });
    },
    close: async () => {
      await client.disconnect();
    },
  };
};

export const todayDate = () => new Date().toISOString().split('T')[0];

const buildRetry = (timeoutMilliseconds: number, retryPeriodMilliseconds: number) => async (f: () => void) => {
  const start = Date.now();
  while (true) {
    try {
      await f();
      return;
    } catch (e) {
      if (Date.now() > start + timeoutMilliseconds) {
        throw e;
      } else {
        console.log(`Assertion failed, retrying in ${retryPeriodMilliseconds}ms`);
        await new Promise((f) => setTimeout(f, retryPeriodMilliseconds));
      }
    }
  }
};

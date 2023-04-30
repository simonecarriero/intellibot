import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN!, { telegram: { webhookReply: true } });

bot.hears('hello', (ctx) => ctx.reply('world'));

export const handler = async (event: any, context: any, callback: any) => {
  await bot.handleUpdate(JSON.parse(event.body));
  return await callback(null, { statusCode: 200, body: '' });
};

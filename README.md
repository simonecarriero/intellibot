# Intellibot

## Run locally:

- `export BOT_TOKEN=<your-bot-token>`
- `yarn start`

## Run tests:

- `yarn test`

## Run e2e tests:

- `export BOT_TOKEN=<your-bot-token>`
- `export TELEGRAM_SESSION=<your-telegram-session>`, see [1]
- `export TELEGRAM_API_ID=<your-telegram-api-id>`, see [1]
- `export TELEGRAM_API_HASH=<your-telegram-api-hash>`, see [1]
- `export TELEGRAM_TEST_GROUP_ID=<your-telegram-test-group-id>`, a group with the account you are authenticating to and the bot
- `yarn e2e`

[1] https://gram.js.org/getting-started/authorization

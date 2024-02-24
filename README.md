# Intellibot

## Run locally:

- `export BOT_TOKEN=<>`
- `export API_BASE_PATH=<>`
- `yarn start`

## Run tests:

- `yarn test`

## Run e2e tests:

- `export BOT_TOKEN=<>`
- `export TELEGRAM_SESSION=<>`, see [1]
- `export TELEGRAM_API_ID=<>`, see [1]
- `export TELEGRAM_API_HASH=<>`, see [1]
- `export TELEGRAM_TEST_GROUP_ID=<>`, a group with the account you are authenticating to and the bot
- `yarn e2e`

[1] https://gram.js.org/getting-started/authorization

#!/usr/bin/env bash
set -m
set -e
trap 'echo "Resetting webhook to \"$OLD_PUBLIC_URL\" and cleaning up" && npx telegraf -m setWebhook -t $BOT_TOKEN -D "{ \"url\": \"$OLD_PUBLIC_URL\", \"drop_pending_updates\": true }"; killall ngrok; kill $BOT_PID' EXIT

if [ -z $BOT_TOKEN ]; then
  echo "Required env variable BOT_TOKEN is missing"
  exit 1
fi
yarn build
node dist/infrastructure/index.js &
BOT_PID=$!

killall ngrok || true && ngrok http 8080 > /dev/null &
sleep 2
PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels/command_line | jq -r '.public_url')
OLD_PUBLIC_URL=$(npx telegraf -m getWebhookInfo -t $BOT_TOKEN | sed -n "s/.*url: '\([^']*\)'.*/\1/p")
echo "Current webhook is \"$OLD_PUBLIC_URL\", setting to $PUBLIC_URL/prod/intellibot"
npx telegraf -m setWebhook -t $BOT_TOKEN -D "{ \"url\": \"$PUBLIC_URL/prod/intellibot\", \"drop_pending_updates\": true }"

if [ "$1" = "attach" ]; then
    echo "*****************************************************"
    echo "Intellibot is up and running, CTRL+C when you're done"
    echo "*****************************************************"
    fg "node dist/infrastructure/index.js"
elif [ "$1" = "e2e" ]; then
    yarn e2e
else
    echo "Exiting, subcommand \"$1\" not known"
    exit 1
fi

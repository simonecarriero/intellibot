#!/usr/bin/env bash
set -e
trap 'echo "Resetting webhook to \"$OLD_PUBLIC_URL\" and cleaning up" && npx telegraf -m setWebhook -t $BOT_TOKEN -D "{ \"url\": \"$OLD_PUBLIC_URL\", \"drop_pending_updates\": true }"; killall ngrok; yarn localstack:stop' EXIT

if [ -z $BOT_TOKEN ]; then
  echo "Required env variable BOT_TOKEN is missing"
  exit 1
fi
yarn build
yarn localstack:start
npx cdklocal bootstrap
npx cdklocal deploy --require-approval never
HOSTNAME=$(awslocal cloudformation describe-stacks --stack-name IntellibotStack --query "Stacks[0].Outputs[?OutputKey=='apiHostname'].OutputValue" --output text)
killall ngrok || true && ngrok http --host-header $HOSTNAME 4566 > /dev/null &
sleep 2
PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels/command_line | jq -r '.public_url')
OLD_PUBLIC_URL=$(npx telegraf -m getWebhookInfo -t $BOT_TOKEN | sed -n "s/.*url: '\([^']*\)'.*/\1/p")
echo "Current webhook is \"$OLD_PUBLIC_URL\", setting to $PUBLIC_URL/prod/intellibot"
npx telegraf -m setWebhook -t $BOT_TOKEN -D "{ \"url\": \"$PUBLIC_URL/prod/intellibot\", \"drop_pending_updates\": true }"

if [ "$1" = "attach" ]; then
    echo "***********************************************************************"
    echo "Intellibot is up and running, say \"hello\" and CTRL+C when you're done"
    echo "***********************************************************************"
    docker attach intellibot-localstack || true
elif [ "$1" = "e2e" ]; then
    yarn e2e
else
    echo "Exiting, subcommand \"$1\" not known"
    exit 1
fi

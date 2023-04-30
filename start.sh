#!/usr/bin/env bash

if [ -z $BOT_TOKEN ]; then
  echo "Required env variable BOT_TOKEN is missing"
  exit 1
fi
yarn build
yarn localstack:start
npx cdklocal bootstrap
npx cdklocal deploy --require-approval never
HOSTNAME=$(awslocal cloudformation describe-stacks --stack-name IntellibotStack --query "Stacks[0].Outputs[?OutputKey=='apiHostname'].OutputValue" --output text)
killall ngrok; ngrok http --host-header $HOSTNAME 4566 > /dev/null &
sleep 2
PUBLIC_URL=$(curl -s http://localhost:4040/api/tunnels/command_line | jq -r '.public_url')
npx telegraf -m setWebhook -t $BOT_TOKEN -D "{ \"url\": \"$PUBLIC_URL/prod/intellibot\" }"
echo "***********************************************************************"
echo "Intellibot is up and running, say \"hello\" and CTRL+C when you're done"
echo "***********************************************************************"
docker attach intellibot-localstack || true
killall ngrok
yarn localstack:stop

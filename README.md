## About

Trust falls for Slack via `setTimeout()` and Redis sorted sets

## Prerequisites

1. You will need an AWS account to access DynamoDB. If you don't want to hook this up to an AWS account, you can [run DynamoDB locally](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html) as an alternative.
2. Install the [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) to deploy our DynamoDB table. Alternatively, you can manually create your table via the console or the CLI and set `teamId` as the hash key.
3. For development you will need to forward requests from Slack to your local environment. I use [ngrok](https://ngrok.com/docs/getting-started/) to handle all this.

## Setup

1. Deploy our DynamoDB table. You can use `sam deploy --template sam.yml --guided` to walk you through the process if you're unfamiliar with SAM.
2. Open a tunnel with `ngrok` (make a note of the Forwarded URL they provide in the output): `ngrok http 3000`.
3. Go into the provided `manifest.yml` file and do find and replace `NGROK_URL_PLACEHOLDER` with the URL mentioned in Step 2.
4. [Create a Slack app](https://api.slack.com/apps/new). Click "Create New App" and choose the "From an app manifest option."

If you want to test with installing to multiple workspaces see [Slack's docs](https://api.slack.com/distribution) and [Bolt's docs](https://slack.dev/bolt-js/concepts#authenticating-oauth) on the subject.

5. Create your `.env` file. There is a `.env.sample` provided. You Slack credentials are available on the "Basic Information" section of your app configuration.
6. Start your Slack bot: `docker compose up -V -d`

## Usage

Invite your bot into a channel using the `/invite @Trusty Chat Falls` command.

- `/fall`
- `/catch`

There is also a `/healthcheck` route available as well.

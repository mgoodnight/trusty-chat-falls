import { SlackCommandMiddlewareArgs } from '@slack/bolt';

import { CatchService } from '../services/catch';

export default async (payload: SlackCommandMiddlewareArgs) => {
  try {
    await payload.ack();
    const say = payload.say;
    const catcher = new CatchService(payload.body.user_id, payload.body.channel_id);
    const successCaughtUserId = await catcher.catchFallingUser();

    if (successCaughtUserId) {
      await say({ text: catcher.getSuccessCaughtMsg(successCaughtUserId) });
    } else {
      await say({ text: catcher.nobodyFallingRes });
    }
  } catch (catchCmdErr) {
    console.log('error', catchCmdErr);
  }
}

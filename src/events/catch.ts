import { SlackCommandMiddlewareArgs } from '@slack/bolt';

import { CatchService } from '../services/catch';

export default async (payload: SlackCommandMiddlewareArgs) => {
  try {
    await payload.ack();
    const say = payload.say;
    const catcher = new CatchService(
      payload.body.user_id,
      payload.body.channel_id,
    );

    const isFalling = await catcher.isUserFalling();
    if (!isFalling) {
      const successCaughtUserId = await catcher.catchFallingUser();

      if (successCaughtUserId) {
        await catcher.sendCaughtRes(say, successCaughtUserId);
      } else {
        await catcher.sendNobodyFallingRes(say);
      }
    } else {
      await catcher.sendFallerNoCatch(say);
    }
  } catch (catchCmdErr) {
    console.error(catchCmdErr);
  }
};

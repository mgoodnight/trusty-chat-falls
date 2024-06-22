import { SlackCommandMiddlewareArgs } from '@slack/bolt';

import { FallService } from '../services/fall';

/**
 * /fall slash command event handler
 *
 * @param {SlackCommandMiddlewareArgs} payload
 */
export default async (payload: SlackCommandMiddlewareArgs) => {
  try {
    await payload.ack();

    const say = payload.say;
    const fall = new FallService(payload.body.user_id, payload.body.channel_id);
    const isFallingAlready = await fall.isUserFalling();

    if (isFallingAlready) {
      await fall.sendAlreadyFallingRes(say);
    } else {
      await Promise.all([fall.setUserFalling(), fall.sendFallingRes(say)]);

      setTimeout(async () => {
        const userCaught = await fall.hasUserBeenCaught();

        if (!userCaught) {
          await fall.sendFallenRes(say);
        }

        await fall.unSetUser();
      }, 5000);
    }
  } catch (fallCmdErr) {
    console.error(fallCmdErr);
  }
};

import { SlackCommandMiddlewareArgs } from '@slack/bolt';
import config from 'config';

import { FallService } from '../services/fall';
import { ConfigSettings } from '../types/config';

export default async (payload: SlackCommandMiddlewareArgs) => {
  try {
    await payload.ack();
    const say = payload.say;
    const fall = new FallService(payload.body.user_id, payload.body.channel_id);
    const isFallingAlready = await fall.isUserFalling();

    if (isFallingAlready) {
      await say({ text: fall.alreadyFallingRes })
    } else {
      await Promise.all([
        fall.setUserFalling(),
        say({ text: fall.fallingRes })
      ]);

      setTimeout(async () => {
        const userCaught = await fall.hasUserBeenCaught();
        if (!userCaught) {
          await say({ text: fall.fallenRes });
        }

        await fall.unSetFallingUser();
      }, config.get<ConfigSettings>('settings').fallMs);
    }
  } catch (fallCmdErr) {
    console.log('error', fallCmdErr);
  }
}

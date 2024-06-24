import { SayFn } from '@slack/bolt';

import { ActionService } from './action';
import cacheService from './cache';
import { ACTION_TYPE } from '../constants';

export class CatchService extends ActionService {
  private readonly caughtEmoji = ':tada:';
  private readonly caughtBaseMsg = 'has successfully caught!';
  private readonly fallerCatchBaseMsg =
    "you can't catch while you are falling!";
  private readonly nobodyFallingBaseMsg =
    'there is no one falling that you can catch!';

  constructor(userId: string, channelId: string) {
    super(ACTION_TYPE.SUCCESS, userId, channelId);
  }

  public async catchFallingUser(): Promise<string | undefined> {
    const [nextFallingUserId] = await cacheService.dequeueFallingUser(
      this.channelId,
    );

    if (nextFallingUserId) {
      await cacheService.setSuccessFallingUser(
        nextFallingUserId,
        this.channelId,
      );
      return nextFallingUserId;
    }
  }

  public async sendNobodyFallingRes(say: SayFn): Promise<void> {
    await say({
      text: `${this.errorEmoji}  <@${this.userId}> ${this.nobodyFallingBaseMsg}`,
    });
  }

  public async sendCaughtRes(say: SayFn, fallingUserId: string): Promise<void> {
    const attachment = {
      text: `${this.caughtEmoji}  <@${this.userId}> ${this.caughtBaseMsg} <@${fallingUserId}>`,
      image_url: this.pickGif(),
    };

    await say({
      text: attachment.text,
      attachments: [attachment],
    });
  }

  public async sendFallerNoCatch(say: SayFn): Promise<void> {
    await say({
      text: `${this.errorEmoji}  <@${this.userId}> ${this.fallerCatchBaseMsg}`,
    });
  }
}

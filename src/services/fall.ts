import { SayFn } from '@slack/bolt';

import { ActionService } from './action';
import cacheService from './cache';
import { ACTION_TYPE } from '../constants';

export class FallService extends ActionService {
  private readonly fallenEmoji = ':skull_and_crossbones:';
  private readonly fallingEmoji = ':rotating_light:';
  private readonly alreadyFallingMsg = 'you are already falling!';
  private readonly fallenBaseMsg = 'has fallen!';
  private readonly fallingBaseMsg = 'is falling...';

  constructor(userId: string, channelId: string) {
    super(ACTION_TYPE.FAIL, userId, channelId);
  }

  public async sendAlreadyFallingRes(say: SayFn): Promise<void> {
    await say({
      text: `${this.errorEmoji}  <@${this.userId}> ${this.alreadyFallingMsg}`,
    });
  }

  public async sendFallenRes(say: SayFn): Promise<void> {
    const text = `${this.fallenEmoji}  <@${this.userId}> ${this.fallenBaseMsg}`;
    const attachment = {
      text,
      image_url: this.pickGif(),
    };

    await say({
      text,
      attachments: [attachment],
    });
  }

  public async sendFallingRes(say: SayFn): Promise<void> {
    await say({
      text: `${this.fallingEmoji}  <@${this.userId}> ${this.fallingBaseMsg}`,
    });
  }

  public async hasUserBeenCaught(): Promise<boolean> {
    return Boolean(
      await cacheService.fallingUserCaught(this.userId, this.channelId),
    );
  }

  public async unSetUser(): Promise<void> {
    await Promise.all([
      cacheService.removeUserSuccessFlag(this.userId, this.channelId),
      cacheService.removeFallingUser(this.channelId, this.userId),
    ]);
  }

  public async setUserFalling(): Promise<void> {
    await cacheService.addFallingUser(this.userId, this.channelId);
  }
}

import { MessageAttachment, SayFn } from '@slack/bolt';

import { ActionService } from './action';
import cacheService from './cache';

export class FallService extends ActionService {
  private readonly fallenEmoji = ':skull_and_crossbones:';
  private readonly fallingEmoji = ':rotating_light:';
  private readonly alreadyFallingMsg = 'you are already falling!';
  private readonly fallenBaseMsg = 'has fallen!';
  private readonly fallingBaseMsg = 'is falling...';

  constructor(userId: string, channelId: string) {
    super('fail', userId, channelId);
  }

  public async sendAlreadyFallingRes(say: SayFn): Promise<void> {
    await say({ text: `${this.errorEmoji}  <@${this.userId}> ${this.alreadyFallingMsg}` });
  }

  public async sendFallenRes(say: SayFn): Promise<void> {
    await say({ attachments: [this.buildFallenResMessage()] });
  }

  public async sendFallingRes(say: SayFn): Promise<void> {
    await say({ text: `${this.fallingEmoji}  <@${this.userId}> ${this.fallingBaseMsg}` });
  }

  public async hasUserBeenCaught(): Promise<boolean> {
    return Boolean(await cacheService.isFallingUserCaught(this.userId, this.channelId));
  }

  public async unSetFallingUser(): Promise<void> {
    await cacheService.removeFallingUser(this.channelId, this.userId);
    await cacheService.removeSuccessFallingUser(this.userId, this.channelId);
  }

  public async setUserFalling(): Promise<void> {
    await cacheService.addFallingUser(this.userId, this.channelId);
  }

  private buildFallenResMessage(): MessageAttachment {
    return {
      text: `${this.fallenEmoji}  <@${this.userId}> ${this.fallenBaseMsg}`,
      image_url: this.pickGif()
    };
  }
}

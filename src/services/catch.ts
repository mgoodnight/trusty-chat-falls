import { MessageAttachment, SayFn } from '@slack/bolt';

import { ActionService } from './action';
import cacheService from './cache';

export class CatchService extends ActionService {
  private readonly caughtEmoji = ':tada:';
  private readonly nobodyFallingEmoji = ':sob:';
  private readonly caughtBaseMsg = 'has successfully caught!';
  private readonly fallerCatchBaseMsg = 'you can\'t catch while you are falling!';
  private readonly nobodyFallingBaseMsg = 'there is no one falling that you can catch!';

  get nobodyFallingRes(): string {
    return `${this.nobodyFallingEmoji}  <@${this.userId}> ${this.nobodyFallingBaseMsg}`;
  }

  constructor(userId: string, channelId: string) {
    super('success', userId, channelId);
  }

  public async catchFallingUser(): Promise<string | undefined> {
    const nextFallingUserId = await cacheService.dequeueFallingUser(this.channelId, this.userId);

    if (nextFallingUserId) {
      await cacheService.setSuccessFallingUser(nextFallingUserId, this.channelId);
      return nextFallingUserId;
    }
  }

  public async sendNobodyFallingRes(say: SayFn): Promise<void> {
    await say({ text: `${this.errorEmoji}  <@${this.userId}> ${this.nobodyFallingBaseMsg}` })
  }

  public async sendCaughtRes(say: SayFn, fallingUserId: string): Promise<void> {
    await say({ attachments: [this.buildCaughtResMessage(fallingUserId)] });
  }

  public async sendFallerNoCatch(say: SayFn): Promise<void> {
    await say({ text: `${this.errorEmoji}  <@${this.userId}> ${this.fallerCatchBaseMsg}` })
  }

  private buildCaughtResMessage(fallingUserId: string): MessageAttachment {
    return {
      text: `${this.caughtEmoji}  <@${this.userId}> ${this.caughtBaseMsg} <@${fallingUserId}>`,
      image_url: this.pickGif()
    };
  }
}
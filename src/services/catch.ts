import cacheService from './cache';

export class CatchService {
  private readonly caughtEmoji = ':tada:';
  private readonly nobodyFallingEmoji = ':sob:';
  private readonly caughtBaseMsg = 'has successfully caught';
  private readonly nobodyFallingBaseMsg = 'there is no one falling that you can catch!';

  get nobodyFallingRes(): string {
    return `${this.nobodyFallingEmoji}  ${this.userId} ${this.nobodyFallingBaseMsg}`;
  }

  constructor(private userId: string, private channelId: string) { }

  public async catchFallingUser(): Promise<string | undefined> {
    const nextFallingUserId = await cacheService.dequeueFallingUser(this.channelId, this.userId);

    if (nextFallingUserId) {
      await cacheService.setSuccessFallingUser(nextFallingUserId, this.channelId);
      return nextFallingUserId;
    }
  }

  public getSuccessCaughtMsg(fallingUserId: string): string {
    return `${this.caughtEmoji}  <@${this.userId}> ${this.caughtBaseMsg} <@${fallingUserId}>`;
  }
}
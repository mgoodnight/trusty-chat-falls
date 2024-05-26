import cacheService from './cache';

export class CatchService {
  private readonly baseCaughtMsg = 'has successfully caught';
  private readonly nobodyFallingMsg = 'There is no one falling that you can catch!';

  get nobodyFallingRes(): string {
    return this.nobodyFallingMsg;
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
    return `<@${this.userId}> ${this.baseCaughtMsg} <@${fallingUserId}>`;
  }
}
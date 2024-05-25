import cacheService from './cache';

export class CatchService {
  private readonly caughtFallingMsg = 'You have successfully caught';
  private readonly nobodyFallingMsg = 'There is no one to catch!';

  get nobodyFallingRes(): string {
    return this.nobodyFallingMsg;
  }

  constructor(private userId: string, private channelId: string) { }

  public async catchFallingUser(): Promise<string | undefined> {
    const nextFallingUserId = await cacheService.dequeueFallingUser(this.channelId);

    if (nextFallingUserId) {
      await cacheService.setSuccessFallingUser(this.userId, this.channelId);
      return nextFallingUserId;
    }
  }

  public getSuccessCaughtMsg(caughtUserId: string): string {
    return `${this.caughtFallingMsg} <@${caughtUserId}>`;
  }
}
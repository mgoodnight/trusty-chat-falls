import cacheService from './cache';

export class FallService {
  private readonly alreadyFallingMsg = 'You are already falling.';
  private readonly fallenMsg = 'You have fallen!';
  private readonly fallingMsg = 'Falling...';

  constructor(private userId: string, private channelId: string) { }

  get alreadyFallingRes(): string {
    return this.alreadyFallingMsg;
  }

  get fallenRes(): string {
    return this.fallenMsg;
  }

  get fallingRes(): string {
    return this.fallingMsg;
  }

  public async isUserFalling(): Promise<boolean> {
    return Boolean(await cacheService.checkFallingUserExists(this.userId, this.channelId));
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
}

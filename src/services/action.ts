import config from 'config';

import cacheService from './cache';
import { ConfigImages } from '../types/config';
import { ACTION_TYPE } from '../constants';

export class ActionService {
  protected readonly errorEmoji = ':x:';

  constructor(private type: ACTION_TYPE, protected userId: string, protected channelId: string) { }

  public async isUserFalling(): Promise<boolean> {
    return Boolean(await cacheService.checkFallingUserExists(this.userId, this.channelId));
  }

  public pickGif(): string | undefined {
    switch (this.type) {
      case 'success': {
        return this.pickRandom(config.get<ConfigImages>('images').success);
      }

      case 'fail': {
        return this.pickRandom(config.get<ConfigImages>('images').fail);
      }
    }
  }

  private pickRandom(list: string[]): string {
    return list[Math.floor(Math.random() * list.length)];
  }
}
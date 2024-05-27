import config from 'config';

import { ConfigImages } from '../types/config';

export class ActionService {
  constructor(private type: 'success' | 'fail') { }

  public pickGif(): string {
    const images: string[] = [];

    switch (this.type) {
      case 'success': {
        images.push(...config.get<ConfigImages>('images').success);
        return this.pickRandom(images);
      }

      case 'fail': {
        images.push(...config.get<ConfigImages>('images').fail);
        return this.pickRandom(images);
      }
    }
  }

  private pickRandom(list: string[]): string {
    return list[Math.floor(Math.random() * list.length)]
  }
}
import Redis from 'ioredis';

import { ConfigRedisDetails } from '../types/config';

export class RedisAdapter {
  private _client: Redis | undefined;

  get client(): Redis {
    if (!this._client) {
      this._client = new Redis(this.connectDetails);
    }

    return this._client;
  }

  constructor(private connectDetails: ConfigRedisDetails) { }
}

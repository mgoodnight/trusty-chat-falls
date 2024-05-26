import Redis from 'ioredis';
import config from 'config';

import { RedisAdapter } from '../adapters/redis';
import { ConfigRedis } from '../types/config';

export class CacheService {
  private main: Redis;
  private readonly userChannelPrefix = 'uc';

  constructor(private connectDetails: ConfigRedis) {
    this.main = new RedisAdapter(this.connectDetails.main).client;
  }

  public async addFallingUser(userId: string, channelId: string): Promise<void> {
    await this.main.zadd(channelId, Date.now(), userId);
  }

  public async checkFallingUserExists(userId: string, channelId: string): Promise<string | null> {
    return await this.main.zscore(channelId, userId)
  }

  public async isFallingUserCaught(userId: string, channelId: string): Promise<number> {
    console.log(this.buildSuccessCacheKey(userId, channelId))
    return await this.main.exists(this.buildSuccessCacheKey(userId, channelId))
  }

  public async dequeueFallingUser(channelId: string, catcherUserId: string): Promise<string | undefined> {
    const setSize = await this.main.zcard(channelId);
    for (let i = 0; i < setSize; i++) {
      const [nextUser] = await this.main.zrange(channelId, i, i + 1);
      if (nextUser && nextUser !== catcherUserId) {
        return nextUser;
      }
    }
  }

  public async removeFallingUser(channelId: string, userId: string): Promise<void> {
    await this.main.zrem(channelId, userId);
  }

  public async removeSuccessFallingUser(userId: string, channelId: string): Promise<void> {
    await this.main.del(this.buildSuccessCacheKey(userId, channelId));
  }

  public async setSuccessFallingUser(userId: string, channelId: string): Promise<void> {
    await this.main.set(this.buildSuccessCacheKey(userId, channelId), 1);
  }

  private buildSuccessCacheKey(userId: string, channelId: string): string {
    return `${this.userChannelPrefix}:${userId}:${channelId}`;
  }
}

export default new CacheService(config.get<ConfigRedis>('redis'));

import Redis from 'ioredis';
import config from 'config';

import { RedisAdapter } from '../adapters/redis';
import { ConfigRedis, ConfigSettings } from '../types/config';

export class CacheService {
  private main: Redis;
  private settingsConfig: ConfigSettings;
  private readonly userChannelPrefix = 'uc';

  constructor(private connectDetails: ConfigRedis) {
    this.main = new RedisAdapter(this.connectDetails.main).client;
    this.settingsConfig = config.get<ConfigSettings>('settings');
  }

  public async addFallingUser(userId: string, channelId: string): Promise<void> {
    await this.main.zadd(channelId, Date.now(), userId);
  }

  public async checkFallingUserExists(userId: string, channelId: string): Promise<string | null> {
    return await this.main.zscore(channelId, userId)
  }

  public async isFallingUserCaught(userId: string, channelId: string): Promise<number> {
    return await this.main.exists(this.buildSuccessCacheKey(userId, channelId))
  }

  public async dequeueFallingUser(channelId: string): Promise<string> {
    const now = Date.now();
    const [next] = await this.main.zrangebyscore(channelId, now - this.settingsConfig.fallMs, now, 'LIMIT', 0, 1);
    await this.main.zrem(channelId, next);
    return next;
  }

  public async removeFallingUser(channelId: string, userId: string): Promise<void> {
    await this.main.zrem(channelId, userId);
  }

  public async removeSuccessFallingUser(userId: string, channelId: string): Promise<void> {
    await this.main.del(this.buildSuccessCacheKey(userId, channelId));
  }

  public async setSuccessFallingUser(userId: string, channelId: string): Promise<void> {
    await this.main.set(this.buildSuccessCacheKey(userId, channelId), '');
  }

  private buildSuccessCacheKey(userId: string, channelId: string): string {
    return `${this.userChannelPrefix}:${userId}:${channelId}`;
  }
}

export default new CacheService(config.get<ConfigRedis>('redis'));

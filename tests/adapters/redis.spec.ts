import config from 'config';
import Redis from 'ioredis';

import { RedisAdapter } from '../../src/adapters/redis';
import { ConfigRedis } from '../../src/types/config';

describe('RedisAdapter tests', () => {
  it('Can create', () => {
    const redis = new RedisAdapter(config.get<ConfigRedis>('redis').main);
    expect(redis).toBeInstanceOf(RedisAdapter);
    expect(redis.client).toBeInstanceOf(Redis);
  });
});

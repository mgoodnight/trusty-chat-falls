const mockRedisAdapter = {
  client: {
    zadd: jest.fn(),
    zpopmin: jest.fn(),
    zrem: jest.fn(),
    del: jest.fn(),
    set: jest.fn(),
  },
};

jest.mock('../../src/adapters/redis', () => ({
  __esModule: true,
  RedisAdapter: jest.fn().mockImplementation(() => mockRedisAdapter),
}));

import cacheServiceDefault from '../../src/services/cache';

describe('CacheService tests', () => {
  const userId = 'mock_user_id';
  const channelId = 'mock_channel_id';

  it('test addFallingUser', async () => {
    const now = Date.now();
    Date.now = jest.fn(() => now);
    await cacheServiceDefault.addFallingUser(userId, channelId);
    expect(mockRedisAdapter.client.zadd).toHaveBeenCalledWith(
      channelId,
      now,
      userId,
    );
  });

  it('test dequeueFallingUser', async () => {
    await cacheServiceDefault.dequeueFallingUser(channelId);
    expect(mockRedisAdapter.client.zpopmin).toHaveBeenCalledWith(channelId);
  });

  it('test removeFallingUser', async () => {
    await cacheServiceDefault.removeFallingUser(channelId, userId);
    expect(mockRedisAdapter.client.zrem).toHaveBeenCalledWith(
      channelId,
      userId,
    );
  });

  it('test removeUserSuccessFlag', async () => {
    await cacheServiceDefault.removeUserSuccessFlag(userId, channelId);
    expect(mockRedisAdapter.client.del).toHaveBeenCalledWith(
      `uc:${userId}:${channelId}`,
    );
  });

  it('test setSuccessFallingUser', async () => {
    await cacheServiceDefault.setSuccessFallingUser(userId, channelId);
    expect(mockRedisAdapter.client.set).toHaveBeenCalledWith(
      `uc:${userId}:${channelId}`,
      1,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

import config from 'config';

import { ActionService } from '../../src/services/action';
import { ConfigImages } from '../../src/types/config';
import { ACTION_TYPE } from '../../src/constants';

jest.mock('../../src/services/cache', () => ({
  __esModule: true,
  default: {
    checkFallingUserExists: jest.fn(),
  },
}));

import CacheService from '../../src/services/cache';

describe('CatchService tests', () => {
  const userId = 'mock_user_id';
  const channelId = 'mock_channel_id';
  let actionService: ActionService;

  beforeEach(() => {
    actionService = new ActionService(ACTION_TYPE.SUCCESS, userId, channelId);
  });

  it('test isUserFalling', async () => {
    const score = `${Date.now()}`;
    const checkFallingSpy = jest
      .spyOn(CacheService, 'checkFallingUserExists')
      .mockResolvedValue(score);
    const output = await actionService.isUserFalling();

    expect(output).toBeTruthy();
    expect(checkFallingSpy).toHaveBeenCalledWith(userId, channelId);
  });

  it('test pickGif success', () => {
    const configImgs = config.get<ConfigImages>('images').success;
    const gif = actionService.pickGif();

    expect(configImgs.includes(gif as string)).toBeTruthy();
  });

  it('test pickGif success', () => {
    actionService = new ActionService(ACTION_TYPE.FAIL, userId, channelId);
    const configImgs = config.get<ConfigImages>('images').fail;
    const gif = actionService.pickGif();

    expect(configImgs.includes(gif as string)).toBeTruthy();
  });
});

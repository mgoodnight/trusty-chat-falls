import config from 'config';

import { CatchService } from '../../src/services/catch';
import { ConfigImages } from '../../src/types/config';

jest.mock('../../src/services/cache', () => ({
  __esModule: true,
  default: {
    dequeueFallingUser: jest.fn(),
    setSuccessFallingUser: jest.fn(),
  },
}));

import CacheService from '../../src/services/cache';

describe('CatchService tests', () => {
  const userId = 'mock_user_id';
  const channelId = 'mock_channel_id';
  let catchService: CatchService;

  beforeEach(() => {
    catchService = new CatchService(userId, channelId);
  });

  it('Can create', async () => {
    expect(catchService).toBeInstanceOf(CatchService);
  });

  it('test catchFallingUser exists', async () => {
    const fallingUser = 'mock_falling_user_id';
    const dequeueFallingUserSpy = jest
      .spyOn(CacheService, 'dequeueFallingUser')
      .mockResolvedValue([fallingUser]);
    const setFallingUserSpy = jest
      .spyOn(CacheService, 'setSuccessFallingUser')
      .mockResolvedValue();
    await catchService.catchFallingUser();

    expect(dequeueFallingUserSpy).toHaveBeenCalledWith(channelId);
    expect(setFallingUserSpy).toHaveBeenCalledWith(fallingUser, channelId);
  });

  it('test catchFallingUser does not exist', async () => {
    const dequeueFallingUserSpy = jest
      .spyOn(CacheService, 'dequeueFallingUser')
      .mockResolvedValue([]);
    const setFallingUserSpy = jest
      .spyOn(CacheService, 'setSuccessFallingUser')
      .mockResolvedValue();
    await catchService.catchFallingUser();

    expect(dequeueFallingUserSpy).toHaveBeenCalledWith(channelId);
    expect(setFallingUserSpy).not.toHaveBeenCalled();
  });

  it('test sendNobodyFallingRes', async () => {
    const expectedText = `:x:  <@${userId}> there is no one falling that you can catch!`;
    const say = jest.fn();
    await catchService.sendNobodyFallingRes(say);

    expect(say).toHaveBeenCalledWith({ text: expectedText });
  });

  it('test sendFallenRes', async () => {
    const fallingUser = 'mock_falling_user_id';
    const expectedText = `:tada:  <@${userId}> has successfully caught! <@${fallingUser}>`;
    const configImgs = config.get<ConfigImages>('images').success;
    const say = jest.fn();
    await catchService.sendCaughtRes(say, fallingUser);

    const callParams = say.mock.calls[0][0];
    expect(callParams.text).toEqual(expectedText);
    expect(callParams.attachments[0].text).toEqual(expectedText);
    expect(
      configImgs.includes(callParams.attachments[0].image_url),
    ).toBeTruthy();
  });

  it('test sendFallerNoCatch', async () => {
    const expectedText = `:x:  <@${userId}> you can't catch while you are falling!`;
    const say = jest.fn();
    await catchService.sendFallerNoCatch(say);

    expect(say).toHaveBeenCalledWith({ text: expectedText });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

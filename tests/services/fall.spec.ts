import config from 'config';

import { FallService } from '../../src/services/fall';
import { ConfigImages } from '../../src/types/config';

jest.mock('../../src/services/cache', () => ({
  __esModule: true,
  default: {
    addFallingUser: jest.fn(),
    fallingUserCaught: jest.fn(),
    removeUserSuccessFlag: jest.fn(),
    removeFallingUser: jest.fn(),
  },
}));

import CacheService from '../../src/services/cache';

describe('FallService tests', () => {
  const userId = 'mock_user_id';
  const channelId = 'mock_channel_id';
  let fallService: FallService;

  beforeEach(() => {
    fallService = new FallService(userId, channelId);
  });

  it('Can create', async () => {
    expect(fallService).toBeInstanceOf(FallService);
  });

  it('test sendAlreadyFallingRes', async () => {
    const expectedText = `:x:  <@${userId}> you are already falling!`;
    const say = jest.fn();
    await fallService.sendAlreadyFallingRes(say);

    expect(say).toHaveBeenCalledWith({ text: expectedText });
  });

  it('test sendFallenRes', async () => {
    const expectedText = `:skull_and_crossbones:  <@${userId}> has fallen!`;
    const configImgs = config.get<ConfigImages>('images').fail;
    const say = jest.fn();
    await fallService.sendFallenRes(say);

    const callParams = say.mock.calls[0][0];
    expect(callParams.text).toEqual(expectedText);
    expect(callParams.attachments[0].text).toEqual(expectedText);
    expect(
      configImgs.includes(callParams.attachments[0].image_url),
    ).toBeTruthy();
  });

  it('test sendFallingRes', async () => {
    const expectedText = `:rotating_light:  <@${userId}> is falling...`;
    const say = jest.fn();
    await fallService.sendFallingRes(say);

    expect(say).toHaveBeenCalledWith({ text: expectedText });
  });

  it('test hasUserBeenCaught', async () => {
    const userCaughtSpy = jest
      .spyOn(CacheService, 'fallingUserCaught')
      .mockResolvedValue(1);
    const output = await fallService.hasUserBeenCaught();

    expect(output).toBeTruthy();
    expect(userCaughtSpy).toHaveBeenCalledWith(userId, channelId);
  });

  it('test unSetUser', async () => {
    const rmUserSuccessFlagSpy = jest
      .spyOn(CacheService, 'removeUserSuccessFlag')
      .mockResolvedValue();
    const rmFallingUserSpy = jest
      .spyOn(CacheService, 'removeFallingUser')
      .mockResolvedValue();
    await fallService.unSetUser();

    expect(rmUserSuccessFlagSpy).toHaveBeenCalledWith(userId, channelId);
    expect(rmFallingUserSpy).toHaveBeenCalledWith(channelId, userId);
  });

  it('test unSetUser', async () => {
    const addFallingUserSpy = jest
      .spyOn(CacheService, 'addFallingUser')
      .mockResolvedValue();
    await fallService.setUserFalling();

    expect(addFallingUserSpy).toHaveBeenCalledWith(userId, channelId);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});

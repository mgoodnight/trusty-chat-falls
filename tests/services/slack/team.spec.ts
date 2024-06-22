import { InstallationQuery } from '@slack/oauth';
import config from 'config';
import { GetCommandOutput } from '@aws-sdk/lib-dynamodb';

jest.mock('../../../src/adapters/dynamodb', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

import DynamoDbAdapter from '../../../src/adapters/dynamodb';
import { SlackTeamService } from '../../../src/services/slack/team';
import { SlackInstall } from '../../../src/types/teams';
import { ConfigDynamoDbTables } from '../../../src/types/config';

describe('TeamService tests', () => {
  const mockTeamId = 'mock_team_id';
  const mockInstall = {
    team: {
      id: mockTeamId,
    },
  } as unknown as SlackInstall;
  const mockTeam = {
    teamId: mockTeamId,
    install: mockInstall,
  };

  it('Can create', async () => {
    const teamService = new SlackTeamService(mockTeam);
    expect(teamService).toBeInstanceOf(SlackTeamService);
  });

  it('Can access install', () => {
    const teamService = new SlackTeamService(mockTeam);
    expect(teamService.install).toEqual(mockInstall);
  });

  it('getStore().storeInstallation() should succeed', async () => {
    const storeFns = SlackTeamService.getStore();
    const upsertSpy = jest.spyOn(SlackTeamService, 'upsertTeam');

    await storeFns.storeInstallation(mockInstall);

    expect(upsertSpy).toHaveBeenCalledWith(mockInstall);
  });

  it('getStore().storeInstallation() should throw an error', async () => {
    const storeFns = SlackTeamService.getStore();
    let errorThrown = false;

    try {
      await storeFns.storeInstallation({} as unknown as SlackInstall);
    } catch (err) {
      errorThrown = true;
    }

    expect(errorThrown).toBeTruthy();
  });

  it('getStore().fetchInstallation() should succeed', async () => {
    const expectedTeamService = new SlackTeamService(mockTeam);
    const storeFns = SlackTeamService.getStore();
    const getSpy = jest
      .spyOn(SlackTeamService, 'getTeam')
      .mockResolvedValue(expectedTeamService);

    await storeFns.fetchInstallation({
      teamId: mockTeamId,
    } as unknown as InstallationQuery<false>);

    expect(getSpy).toHaveBeenCalledWith(mockTeamId);
  });

  it('getStore().fetchInstallation() should throw an error', async () => {
    const storeFns = SlackTeamService.getStore();
    const getSpy = jest.spyOn(SlackTeamService, 'getTeam');
    let errorThrown = false;

    try {
      await storeFns.fetchInstallation(
        {} as unknown as InstallationQuery<false>,
      );
    } catch (err) {
      errorThrown = true;
    }

    expect(errorThrown).toBeTruthy();
    expect(getSpy).not.toHaveBeenCalled();
  });

  it('upsertTeam should succeed', async () => {
    const expectedTeam = {
      teamId: mockTeamId,
      install: mockInstall,
    };
    const expectedDynamoParams = {
      TableName: config.get<ConfigDynamoDbTables>('dynamoDb.tables').installs,
      Item: expectedTeam,
    };
    const putspy = jest.spyOn(DynamoDbAdapter, 'put');

    await SlackTeamService.upsertTeam(mockInstall);

    expect(putspy).toHaveBeenCalledWith(expectedDynamoParams);
  });

  it('getSlackTeam should return team', async () => {
    const expectedGetRes = { Item: { install: mockInstall } };
    jest
      .spyOn(DynamoDbAdapter, 'get')
      .mockResolvedValue(expectedGetRes as unknown as GetCommandOutput);
    const expectedTeam = await SlackTeamService.getTeam(mockTeamId);

    expect(expectedTeam).toBeInstanceOf(SlackTeamService);
    expect(expectedTeam?.install).toEqual(mockInstall);
  });

  it('getSlackTeam should return undefined', async () => {
    jest
      .spyOn(DynamoDbAdapter, 'get')
      .mockResolvedValue({} as unknown as GetCommandOutput);
    const expectedTeam = await SlackTeamService.getTeam(mockTeamId);
    expect(expectedTeam).toBe(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});

import { InstallationQuery, InstallationStore } from '@slack/oauth';
import config from 'config';

import DynamoDbClient from '../../adapters/dynamodb';
import { ConfigDynamoDbTables } from '../../types/config';
import { SlackInstall, SlackTeam } from '../../types/teams';

export class SlackTeamService {
  static getStore(): InstallationStore {
    return {
      storeInstallation: async (install: SlackInstall): Promise<void> => {
        const teamId = install?.team?.id as string;

        if (teamId) {
          const team = await SlackTeamService.getSlackTeam(teamId);
          if (team) {
            SlackTeamService.upsertTeam(install);
          }
        } else {
          throw new Error(
            'Failed saving installation data to installationStore',
          );
        }
      },
      fetchInstallation: async (
        query: InstallationQuery<boolean>,
      ): Promise<SlackInstall> => {
        const teamId = query.teamId;

        if (teamId) {
          const team = await SlackTeamService.getSlackTeam(teamId);
          return team?.install as SlackInstall;
        }

        throw new Error('Failed fetching installation from installationStore');
      },
    };
  }

  static async upsertTeam(install: SlackInstall): Promise<SlackTeamService> {
    const newTeam = { teamId: install.team?.id as string, install };
    await DynamoDbClient.put(
      config.get<ConfigDynamoDbTables>('dynamoDb.tables').installs,
      newTeam,
    );
    return new SlackTeamService(newTeam);
  }

  static async getSlackTeam(
    teamId: string,
  ): Promise<SlackTeamService | undefined> {
    const teamInstall = await DynamoDbClient.get(
      config.get<ConfigDynamoDbTables>('dynamoDb.tables').installs,
      { teamId },
    );
    if (teamInstall.Item) {
      return new SlackTeamService(teamInstall.Item as SlackTeam);
    }
  }

  get install(): SlackInstall {
    return this.team.install;
  }

  constructor(private team: SlackTeam) {}
}

import { InstallationQuery, InstallationStore } from '@slack/oauth';
import config from 'config';

import DynamoDbAdapter from '../../adapters/dynamodb';
import { ConfigDynamoDbTables } from '../../types/config';
import { SlackInstall, SlackTeam } from '../../types/teams';

export class SlackTeamService {
  /**
   * Static method to get Slack InstallationStore
   *
   * @static
   * @returns {InstallationStore}
   * @memberof SlackTeamService
   */
  static getStore(): InstallationStore {
    return {
      storeInstallation: async (install: SlackInstall): Promise<void> => {
        const teamId = install?.team?.id as string;
        if (teamId) {
          await SlackTeamService.upsertTeam(install);
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
          const team = await SlackTeamService.getTeam(teamId);
          return team?.install as SlackInstall;
        }

        throw new Error('Failed fetching installation from installationStore');
      },
    };
  }

  /**
   * Static method to upsert a Slack team installation
   *
   * @static
   * @param {SlackInstall} [install]
   * @returns {Promise<void>}
   * @memberof SlackTeamService
   */
  static async upsertTeam(install: SlackInstall): Promise<void> {
    const newteam = { teamId: install.team?.id as string, install };
    await DynamoDbAdapter.put({
      TableName: config.get<ConfigDynamoDbTables>('dynamoDb.tables').installs,
      Item: newteam,
    });
  }

  /**
   * Static method to get a SlackTeamService
   *
   * @static
   * @param {string} [teamId]
   * @returns {Promise<SlackTeamService|undefined>}
   * @memberof SlackTeamService
   */
  static async getTeam(teamId: string): Promise<SlackTeamService | undefined> {
    const teamInstall = await DynamoDbAdapter.get({
      TableName: config.get<ConfigDynamoDbTables>('dynamoDb.tables').installs,
      Key: { teamId },
    });

    if (teamInstall.Item) {
      return new SlackTeamService(teamInstall.Item as SlackTeam);
    }
  }

  /**
   * Slack install getter
   *
   * @readonly
   * @type {SlackInstall}
   * @memberof SlackTeamService
   */
  get install(): SlackInstall {
    return this.team.install;
  }

  constructor(private team: SlackTeam) {}
}

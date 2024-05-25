import { App, AppOptions, LogLevel } from '@slack/bolt';
import config from 'config';

import fallHandler from './events/fall';
import catchHandler from './events/catch';
import { SlackTeamService } from './services/slack/team';
import { ConfigSlackInstall, ConfigServer } from './types/config';

/**
 * Class to setup and run our application
 *
 * @export
 * @class Server
 */
export class Server {
  protected app: App;

  /**
   * Creates an instance of Server.
   * @memberof Server
   */
  constructor() {
    const installConfig = config.get<ConfigSlackInstall>('slack.install');
    const initOptions: AppOptions = {
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      stateSecret: process.env.SLACK_STATE_SECRET,
      signingSecret: process.env.SLACK_SIGNING_SECRET as string,
      scopes: installConfig.scopes,
      installerOptions: {
        authVersion: 'v2',
        directInstall: true
      },
      installationStore: SlackTeamService.getStore(),
    };

    this.app = new App(initOptions);
    this.app.command('/fall', fallHandler);
    this.app.command('/catch', catchHandler);
  }

  /**
   * Starts our application
   *
   * @memberof Server
   */
  public start() {
    const port = config.get<ConfigServer>('server').port;
    this.app.start(port).then(() => console.log('info', `Server listening on port ${port}`));
  }
}

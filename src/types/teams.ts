import { Installation } from '@slack/oauth';

export type SlackInstall = Installation<'v1' | 'v2', boolean>;

export interface SlackTeam {
  teamId: string;
  install: SlackInstall;
}
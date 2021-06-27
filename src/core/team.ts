import { MessageEmbed } from 'discord.js';
import { apiClient } from '../api/client';
import { getSdk } from '../api/generated/graphql';
import { colors } from '../constants';
import { ErrorEmbed, WarningEmbed } from '../core/customEmbeds';
import { logger } from '../util/logger';
import { playerToString } from './print';

export async function getTeam(teamId: number) {
  const sdk = getSdk(apiClient);

  try {
    const { team } = await sdk.GetTeam({ id: teamId });

    if (team == null) {
      return WarningEmbed(`Team with ID ${teamId} was not found!`);
    }

    const players = [
      playerToString(team.PlayerH1),
      playerToString(team.PlayerH2),
      playerToString(team.PlayerH3),
      playerToString(team.PlayerH4),
      playerToString(team.PlayerH5),
    ];

    return new MessageEmbed({
      color: colors.primary,
      title: `Team ${team.teamName}`,
      description: players.join('\n'),
      timestamp: Date.now(),
      footer: { text: `ID ${teamId}` },
      type: 'rich',
    });
  } catch (err) {
    logger.error(err);
    return ErrorEmbed(err.response.errors[0].message);
  }
}

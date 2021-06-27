import { MessageEmbed } from 'discord.js';
import { apiClient } from '../api/client';
import { getSdk } from '../api/generated/graphql';
import { colors } from '../constants';
import { ErrorEmbed, WarningEmbed } from '../core/customEmbeds';
import { printLevelName } from '../core/print';
import { logger } from '../util/logger';

export async function getPlayer(userId: string, userTag: string): Promise<MessageEmbed> {
  const sdk = getSdk(apiClient);

  try {
    const { player } = await sdk.GetPlayer({ userId: userId });

    if (player == null) {
      return WarningEmbed(`Player \`${userTag}\` is not in database!`);
    }

    return new MessageEmbed({
      color: colors.primary,
      fields: [
        {
          name: 'Skill Level',
          value: `${printLevelName(player.skillLevel)} (${player.skillLevel})`,
          inline: true,
        },
        { name: 'Favorite Map', value: player.favoriteMap, inline: true },
      ],
      image: { url: player.imageUrl },
      title: player.userTag,
      timestamp: Date.now(),
      footer: { text: userId },
      type: 'rich',
    });
  } catch (err) {
    logger.error(err);
    return ErrorEmbed(err.message);
  }
}

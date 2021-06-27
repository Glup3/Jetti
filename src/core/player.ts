import { MessageEmbed, User } from 'discord.js';
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
      return WarningEmbed(`Player \`${userTag}\` is not in the database!`);
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
    return ErrorEmbed(err.response.errors[0].message);
  }
}

export async function addPlayer(user: User, level: number): Promise<MessageEmbed> {
  const sdk = getSdk(apiClient);

  try {
    const { player } = await sdk.GetPlayer({ userId: user.id });

    if (player != null) {
      return WarningEmbed(`Player \`${user.tag}\` was already added!`);
    }

    const { newPlayer } = await sdk.AddPlayer({
      userId: user.id,
      level: level,
      userTag: user.tag,
      imageUrl:
        user.avatarURL() != null
          ? user.avatarURL({ size: 2048 })
          : `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png`,
    });

    return new MessageEmbed({
      color: colors.success,
      title: newPlayer.userTag,
      description: 'Player was successfully added!',
      fields: [
        {
          name: 'Skill Level',
          value: `${printLevelName(newPlayer.skillLevel)} (${newPlayer.skillLevel})`,
          inline: true,
        },
        { name: 'Favorite Map', value: newPlayer.favoriteMap, inline: true },
      ],
      image: { url: newPlayer.imageUrl },
      timestamp: Date.now(),
      footer: { text: user.id },
      type: 'rich',
    });
  } catch (err) {
    logger.error(err);
    return ErrorEmbed(err.response.errors[0].message);
  }
}

export async function removePlayer(user: User): Promise<MessageEmbed> {
  const sdk = getSdk(apiClient);

  try {
    const { player } = await sdk.GetPlayer({ userId: user.id });

    if (player == null) {
      return WarningEmbed(`Player \`${user.tag}\` is not in the database!`);
    }

    const { removedPlayer } = await sdk.RemovePlayer({ userId: user.id });

    return new MessageEmbed({
      color: colors.danger,
      title: removedPlayer.userTag,
      description: 'Player was successfully removed!',
      fields: [
        {
          name: 'Skill Level',
          value: `${printLevelName(removedPlayer.skillLevel)} (${removedPlayer.skillLevel})`,
          inline: true,
        },
        { name: 'Favorite Map', value: removedPlayer.favoriteMap, inline: true },
      ],
      image: { url: removedPlayer.imageUrl },
      timestamp: Date.now(),
      footer: { text: user.id },
      type: 'rich',
    });
  } catch (err) {
    logger.error(err);
    return ErrorEmbed(err.response.errors[0].message);
  }
}

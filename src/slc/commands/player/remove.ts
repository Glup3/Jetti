import { CommandoClient } from 'discord.js-commando';
import { removePlayer } from '../../../core/player';
import { reply } from '../../slc';
import { Interaction } from '../../types';

export default async (interaction: Interaction, client: CommandoClient) => {
  const args = interaction.data.options[0];
  const userId = args.options[0].value as string;

  const guild = client.guilds.cache.get(interaction.guild_id);
  const user = guild.members.cache.get(userId).user;
  const embed = await removePlayer(user);

  reply(interaction, embed);
};

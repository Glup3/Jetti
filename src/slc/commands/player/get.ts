import { getPlayer } from '../../../core/player';
import { reply } from '../../slc';
import { Interaction } from '../../types';

export default async (interaction: Interaction) => {
  const subCommand = interaction.data.options[0];
  const user = subCommand.options[0];
  const resolvedUser = interaction.data.resolved.users[user.value];
  const userTag = resolvedUser.username + '#' + resolvedUser.discriminator;

  const embed = await getPlayer(user.value, userTag);

  reply(interaction, embed);
};

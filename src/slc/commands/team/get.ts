import { getTeam } from '../../../core/team';
import { reply } from '../../slc';
import { Interaction } from '../../types';

export default async (interaction: Interaction) => {
  const args = interaction.data.options[0];
  const teamId = args.options[0].value;

  const embed = await getTeam(teamId);

  reply(interaction, embed);
};

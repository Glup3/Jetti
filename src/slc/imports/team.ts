import { ApplicationCommandOptionType, SlashCommand, SlashCommandOption } from '../types';

const getCommand: SlashCommandOption = {
  name: 'get',
  description: 'Get information about a Team',
  type: ApplicationCommandOptionType.SUB_COMMAND,
  options: [
    {
      name: 'id',
      description: 'What is the ID of the team?',
      type: ApplicationCommandOptionType.INTEGER,
      required: true,
    },
  ],
};

const teamCommand: SlashCommand = {
  name: 'team',
  description: 'Commands related to teams',
  options: [getCommand],
};

export default teamCommand;

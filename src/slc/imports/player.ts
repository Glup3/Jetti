import { ApplicationCommandOptionType, SlashCommand, SlashCommandOption } from '../types';

const getCommand: SlashCommandOption = {
  name: 'get',
  description: 'Get information about a Player',
  type: ApplicationCommandOptionType.SUB_COMMAND,
  options: [
    {
      name: 'user',
      description: 'Which player do you want?',
      type: ApplicationCommandOptionType.USER,
      required: true,
    },
  ],
};

const addCommand: SlashCommandOption = {
  name: 'add',
  description: 'Add a Player',
  type: ApplicationCommandOptionType.SUB_COMMAND,
  options: [
    {
      name: 'user',
      description: 'Which player do you want?',
      type: ApplicationCommandOptionType.USER,
      required: true,
    },
    {
      name: 'level',
      description: 'What is the skill level?',
      type: ApplicationCommandOptionType.INTEGER,
      required: true,
    },
  ],
};

const removeCommand: SlashCommandOption = {
  name: 'remove',
  description: 'Remove a Player',
  type: ApplicationCommandOptionType.SUB_COMMAND,
  options: [
    {
      name: 'user',
      description: 'Which player do you want?',
      type: ApplicationCommandOptionType.USER,
      required: true,
    },
  ],
};

const playerCommand: SlashCommand = {
  name: 'player',
  description: 'Commands related to players',
  options: [getCommand, addCommand, removeCommand],
};

export default playerCommand;

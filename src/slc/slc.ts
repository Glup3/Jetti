import { MessageEmbed } from 'discord.js';
import axios from '../api/axios';
import { getPlayer } from '../core/player';
import { logger } from '../util/logger';
import {
  ApplicationCommandOptionType,
  ApplicatonCommandInteractionDataOption,
  Interaction,
  SlashCommand,
  SlashCommandOption,
} from './types';

const urlEnv = process.env.NODE_ENV === 'development' ? `/guilds/${process.env.GUILD_ID_DEV}` : '';
const baseURL = 'https://discord.com/api/v8';

const playerGetCommand: SlashCommandOption = {
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

const playerRemoveCommand: SlashCommandOption = {
  name: 'remove',
  description: 'Remove Player',
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

const playerTest: SlashCommandOption = {
  name: 'test',
  description: 'Test',
  type: ApplicationCommandOptionType.SUB_COMMAND_GROUP,
  options: [playerGetCommand],
};

const playerCommand: SlashCommand = {
  name: 'player',
  description: 'Commands related to players',
  options: [playerGetCommand, playerRemoveCommand, playerTest],
};

const reply = async (interaction: Interaction, response: MessageEmbed | string): Promise<void> => {
  const callbackURL = baseURL + `/interactions/${interaction.id}/${interaction.token}/callback`;
  let data;

  if (response instanceof MessageEmbed) {
    data = {
      embeds: [response],
    };
  } else {
    data = {
      content: response,
    };
  }

  try {
    await axios.post(callbackURL, {
      type: 4,
      data,
    });
  } catch (err) {
    logger.error(err);
  }
};

export const registerSlashCommands = async (applicationId: string) => {
  const url = baseURL + `/applications/${applicationId}` + urlEnv + '/commands';

  try {
    await axios.post(url, {
      name: 'sos',
      description: 'Calls SOS',
    } as SlashCommand);

    await axios.post(url, playerCommand);
  } catch (err) {
    logger.error(err);
  }
};

export const handleSlashCommands = async (interaction: Interaction) => {
  logger.info('interaction', interaction);
  const { data } = interaction;

  const commandArgs: string[] = [data.name.toLowerCase(), ...getSubCommand(data.options)];
  const command = commandArgs.join(' ');

  try {
    switch (command) {
      case 'sos': {
        reply(interaction, 'SOS received!');
        break;
      }

      case 'player get': {
        const subCommand = data.options[0];
        const user = subCommand.options[0];
        const resolvedUser = data.resolved.users[user.value];
        const userTag = resolvedUser.username + '#' + resolvedUser.discriminator;
        reply(interaction, await getPlayer(user.value, userTag));
        break;
      }

      default: {
        reply(interaction, `No implementation found for command '${command}'`);
        break;
      }
    }
  } catch (err) {
    logger.error(err);
  }
};

const getSubCommand = (options: ApplicatonCommandInteractionDataOption[]): string[] => {
  if (options === undefined) {
    return [];
  }

  const option = options[0];

  if (option.type === ApplicationCommandOptionType.SUB_COMMAND_GROUP) {
    return [option.name.toLowerCase(), ...getSubCommand(option.options)];
  }

  if (option.type === ApplicationCommandOptionType.SUB_COMMAND) {
    return [option.name.toLowerCase()];
  }

  throw new Error(`Unknown Sub Command Type: ${option.type}`);
};

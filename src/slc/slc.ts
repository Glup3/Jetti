import { MessageEmbed } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import glob from 'glob';
import path from 'path';
import axios from '../api/axios';
import { logger } from '../util/logger';
import { ApplicationCommandOptionType, ApplicatonCommandInteractionDataOption, Interaction } from './types';

const urlEnv = process.env.NODE_ENV === 'development' ? `/guilds/${process.env.GUILD_ID_DEV}` : '';
const baseURL = 'https://discord.com/api/v8';

export const reply = async (interaction: Interaction, response: MessageEmbed | string): Promise<void> => {
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
    logger.error('Error replying to message', err);
  }
};

export const importSlashCommands = async (applicationId: string) => {
  const url = baseURL + `/applications/${applicationId}` + urlEnv + '/commands';

  const baseSrc = path.join(__dirname, '/imports');
  const files = glob.sync('*.*(ts|js)', { cwd: baseSrc });

  const promises = files.map(async (file) => {
    const command = await import(baseSrc + '/' + file);
    return axios.post(url, command.default);
  });

  try {
    await Promise.all(promises);
    logger.info('Imported Slash Commands %O', files);
  } catch (err) {
    logger.error(err);
  }
};

export const registerSlashCommands = async (): Promise<
  Map<string, (interaction: Interaction, client: CommandoClient) => Promise<void>>
> => {
  const baseSrc = path.join(__dirname, '/commands');
  const files = glob.sync('**/*.*(ts|js)', { cwd: baseSrc });
  const slashCommands = new Map<string, () => Promise<void>>();

  for (const file of files) {
    const command = file.slice(0, -3).replace(/\//g, ' ');

    try {
      const slashEvent = await import(baseSrc + '/' + file);
      slashCommands.set(command, slashEvent.default);
      logger.debug('Loaded Slash Command "%s"', command);
    } catch (err) {
      logger.error('Error importing %O', err);
    }
  }

  return slashCommands;
};

export const handleSlashCommands = async (
  interaction: Interaction,
  slashCommands: Map<string, (interaction: Interaction, client: CommandoClient) => Promise<void>>,
  client: CommandoClient,
) => {
  const commandArgs: string[] = [interaction.data.name.toLowerCase(), ...getSubCommand(interaction.data.options)];
  const command = commandArgs.join(' ');

  try {
    const handler = slashCommands.get(command);

    if (handler) {
      await handler(interaction, client);
    } else {
      reply(interaction, `No implementation found for command '${command}'`);
    }
  } catch (err) {
    logger.error(err);
    reply(interaction, `Error occurred while executing command '${command}'`);
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

import { MessageEmbed } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import axios from '../api/axios';
import { getPlayer } from '../core/player';
import { logger } from '../util/logger';
import { ApplicationCommandOptionType, Interaction, SlashCommand, SlashCommandOption } from './types';

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

const playerCommand: SlashCommand = {
  name: 'player',
  description: 'Commands related to players',
  options: [playerGetCommand, playerRemoveCommand],
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

export const registerSlashCommands = async (applicationId: string, client: CommandoClient) => {
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

  // TODO: Remove magic when it is officialy released
  // @ts-expect-error: Event 'INTERACTION_CREATE' is not yet implemented in discord.js-commando
  client.ws.on('INTERACTION_CREATE', async (interaction: Interaction) => {
    const command = interaction.data.name.toLowerCase();

    try {
      if (command === 'sos') {
        reply(interaction, 'SOS received!');
      }

      if (command === 'player') {
        const subCommand = interaction.data.options[0];

        if (subCommand.name.toLowerCase() === 'get') {
          const user = subCommand.options[0];
          const resolvedUser = interaction.data.resolved.users[user.value];
          const userTag = resolvedUser.username + '#' + resolvedUser.discriminator;

          reply(interaction, await getPlayer(user.value, userTag));
        }
      }
    } catch (err) {
      logger.error(err);
    }
  });
};

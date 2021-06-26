import { CommandoClient } from 'discord.js-commando';
import axios from '../api/axios';
import { logger } from '../util/logger';
import { Interaction, SlashCommand } from './types';

const urlEnv = process.env.NODE_ENV === 'development' ? `/guilds/${process.env.GUILD_ID_DEV}` : '';

export const registerSlashCommands = async (applicationId: string, client: CommandoClient) => {
  const baseURL = 'https://discord.com/api/v8';
  const url = baseURL + `/applications/${applicationId}` + urlEnv + '/commands';

  try {
    await axios.post(url, {
      name: 'sos',
      description: 'Calls SOS',
    } as SlashCommand);
  } catch (err) {
    logger.error(err);
  }

  // TODO: Remove magic when it is officialy released
  // @ts-expect-error: Event 'INTERACTION_CREATE' is not yet implemented in discord.js-commando
  client.ws.on('INTERACTION_CREATE', async (interaction: Interaction) => {
    const command = interaction.data.name.toLowerCase();
    const callbackURL = baseURL + `/interactions/${interaction.id}/${interaction.token}/callback`;

    try {
      if (command === 'sos') {
        await axios.post(callbackURL, {
          type: 4,
          data: {
            content: 'SOS received, sending help!',
          },
        });
      }
    } catch (err) {
      logger.error(err);
    }
  });
};

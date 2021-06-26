import axios from '../api/axios';
import { logger } from '../util/logger';
import { SlashCommand } from './types/SlashCommand';

const urlEnv = process.env.NODE_ENV === 'development' ? `/guilds/${process.env.GUILD_ID_DEV}` : '';

export const registerSlashCommands = async (applicationId: string) => {
  const baseURL = `https://discord.com/api/v8/applications/${applicationId}`;

  const url = baseURL + urlEnv + '/commands';

  try {
    await axios.post(url, {
      name: 'sos',
      description: 'Calls SOS',
    } as SlashCommand);
  } catch (err) {
    logger.error(err);
  }
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import { botStatus } from './constants';
import { randomStatus } from './core/status';
import { handleSlashCommands, registerSlashCommands } from './slc/slc';
import { logger } from './util/logger';

const client = new CommandoClient({
  owner: process.env.BOT_OWNER,
  commandPrefix: process.env.NODE_ENV === 'development' ? '$' : '!',
  presence: {
    activity: botStatus[0],
    status: 'dnd',
  },
});

client
  .on('error', (message) => logger.error(message))
  .on('warn', (message) => logger.warn(message))
  .on('debug', (message) => logger.debug(message))
  .on('ready', async () => {
    logger.info(`Client ready: logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);

    randomStatus(client);
  })
  .on('disconnect', () => {
    logger.warn('Disconnected');
  });

// TODO: Remove magic when it is officialy released
// @ts-expect-error: Event 'INTERACTION_CREATE' is not yet implemented in discord.js-commando
client.ws.on('INTERACTION_CREATE', handleSlashCommands);

client.registry
  .registerGroups([
    ['team', 'Team commands'],
    ['player', 'Player commands'],
    ['match', 'Match commands'],
  ])
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerDefaultCommands({
    unknownCommand: false,
  })
  .registerCommandsIn({
    filter: /^([^.].*)\.(js|ts)$/,
    dirname: path.join(__dirname, 'commands'),
  });

(async () => {
  await client.login(process.env.BOT_TOKEN);
  await registerSlashCommands(client.user.id);
})();

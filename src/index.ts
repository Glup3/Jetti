import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import { botStatus } from './constants';
import { randomStatus } from './core/status';
import { logger } from './util/logger';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const client = new CommandoClient({
  owner: process.env.BOT_OWNER,
  commandPrefix: process.env.NODE_ENV === 'development' ? '$' : '!',
  presence: {
    activity: botStatus[0],
    status: 'dnd',
  },
});

client
  .on('error', logger.error.bind(logger))
  .on('warn', logger.warn.bind(logger))
  .on('debug', logger.debug.bind(logger))
  .on('ready', async () => {
    logger.info(`Client ready: logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);

    randomStatus(client);
  })
  .on('disconnect', () => {
    logger.warn('Disconnected');
  });

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

client.login(process.env.BOT_TOKEN);

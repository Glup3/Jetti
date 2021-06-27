import { User } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { getPlayer } from '../../core/player';

interface PromptArgs {
  user: User;
}

export default class GetPlayerCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'get-player',
      aliases: ['gp'],
      group: 'player',
      memberName: 'get-player',
      description: 'Get information about a Player',
      argsCount: 1,
      args: [
        {
          key: 'user',
          prompt: 'Which player do you want? Ping him! (@username)',
          type: 'user',
        },
      ],
    });
  }

  async run(message: CommandoMessage, { user }: PromptArgs) {
    return message.say(await getPlayer(user.id, user.tag));
  }
}

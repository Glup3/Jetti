import { User } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { removePlayer } from '../../core/player';

interface PromptArgs {
  user: User;
}

export default class RemovePlayerCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'remove-player',
      aliases: ['rp'],
      group: 'player',
      memberName: 'remove-player',
      description: 'Removes a player from the database',
      argsCount: 1,
      args: [
        {
          key: 'user',
          prompt: 'Which user do you wanna add? Ping him (@UserName)',
          type: 'user',
        },
      ],
      ownerOnly: true,
    });
  }

  async run(message: CommandoMessage, { user }: PromptArgs) {
    return message.say(await removePlayer(user));
  }
}

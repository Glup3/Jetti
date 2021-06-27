import { User } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { addPlayer } from '../../core/player';

interface PromptArgs {
  user: User;
  level: number;
}

export default class AddPlayerCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'add-player',
      aliases: ['ap'],
      group: 'player',
      memberName: 'add-player',
      description: 'Adds a new Player to the database',
      argsCount: 2,
      args: [
        {
          key: 'user',
          prompt: 'Which user do you wanna add? Ping him (@username)',
          type: 'user',
        },
        {
          key: 'level',
          prompt: "What's his/her skill level?",
          type: 'float',
          validate: (level: number) => level >= 1 && level <= 8,
        },
      ],
    });
  }

  async run(message: CommandoMessage, { user, level }: PromptArgs) {
    return message.say(await addPlayer(user, level));
  }
}

import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { getTeam } from '../../core/team';

interface PromptArgs {
  teamId: number;
}

export default class GetTeamCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'get-team',
      aliases: ['gt'],
      group: 'team',
      memberName: 'get-team',
      description: 'Get info about team',
      argsCount: 1,
      args: [
        {
          key: 'teamId',
          prompt: 'What is the team ID?',
          type: 'integer',
        },
      ],
    });
  }

  async run(message: CommandoMessage, { teamId }: PromptArgs) {
    return message.say(await getTeam(teamId));
  }
}

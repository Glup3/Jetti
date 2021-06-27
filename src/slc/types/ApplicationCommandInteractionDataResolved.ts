import { Channel, GuildMember, Role, User } from 'discord.js';

export interface ApplicationCommandInteractionDataResolved {
  users: {
    [key: string]: User;
  };
  members: {
    [key: string]: GuildMember;
  };
  roles: {
    [key: string]: Role;
  };
  channels: {
    [key: string]: Channel;
  };
}

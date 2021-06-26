import { Snowflake, Message, User, GuildMember } from 'discord.js';
import { ApplicationCommandInteractionData } from './ApplicationCommandInteractionData';
import { InteractionRequestType } from './InteractionRequestType';

export interface Interaction {
  id: Snowflake;
  application_id: Snowflake;
  type: InteractionRequestType;
  data?: ApplicationCommandInteractionData;
  guild_id?: Snowflake;
  channel_id?: Snowflake;
  member?: GuildMember;
  user?: User;
  token: string;
  version: number;
  message?: Message;
}

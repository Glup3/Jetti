import { Snowflake } from 'discord.js';
import { ApplicatonCommandInteractionDataOption } from './ApplicatonCommandInteractionDataOption';

export interface ApplicationCommandInteractionData {
  id: Snowflake;
  name: string;
  options?: ApplicatonCommandInteractionDataOption[];
}

import { Snowflake } from 'discord.js';
import { ApplicationCommandInteractionDataResolved } from './ApplicationCommandInteractionDataResolved';
import { ApplicatonCommandInteractionDataOption } from './ApplicatonCommandInteractionDataOption';

export interface ApplicationCommandInteractionData {
  id: Snowflake;
  name: string;
  resolved?: ApplicationCommandInteractionDataResolved;
  options?: ApplicatonCommandInteractionDataOption[];
}

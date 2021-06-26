import { ApplicationCommandOptionType } from './ApplicationCommandOptionType';

export interface ApplicatonCommandInteractionDataOption {
  name: string;
  type: ApplicationCommandOptionType;
  // TODO: check this type
  // value?: ApplicationCommandOptionType;
  value?: any;
  options?: ApplicatonCommandInteractionDataOption[];
}

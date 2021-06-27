import { ApplicationCommandOptionType } from './ApplicationCommandOptionType';
import { SlashCommandOptionChoice } from './SlashCommandOptionChoice';

export interface SlashCommandOption {
  type: ApplicationCommandOptionType;
  name: string;
  description: string;
  required?: boolean;
  choices?: SlashCommandOptionChoice;
  options?: SlashCommandOption[];
}

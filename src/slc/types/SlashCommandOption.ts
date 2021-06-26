import { SlashCommandOptionChoice } from './SlashCommandOptionChoice';

export interface SlashCommandOption {
  type: number;
  name: string;
  description: string;
  required?: boolean;
  choices?: SlashCommandOptionChoice;
  options?: SlashCommandOption;
}

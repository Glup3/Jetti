import { SlashCommandOption } from './SlashCommandOption';

export interface SlashCommand {
  name: string;
  description: string;
  options?: SlashCommandOption[];
}

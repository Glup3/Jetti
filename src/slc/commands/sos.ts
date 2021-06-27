import { reply } from '../slc';
import { Interaction } from '../types';

export default async (interaction: Interaction) => {
  reply(interaction, 'SOS received!');
};

import channelsData from '@/constants/channels.json';

export interface Channel {
  'Nº': number;
  NOMBRE: string;
  LOGO?: string;
  STREAM?: string;
}

export function loadChannels(): Channel[] {
  try {
    return (channelsData as Channel[]).filter(channel => channel.NOMBRE);
  } catch (error) {
    console.error('Error loading channels:', error);
    return [];
  }
}

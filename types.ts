
export type ArchetypeId = 'HEALER' | 'ADVENTURER' | 'SCAVENGER';

export interface Archetype {
  id: ArchetypeId;
  name: string;
  subtitle: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    text: string;
    gradient: string;
  };
  keywords: string[];
}

export interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    archetype: ArchetypeId;
  }[];
}

export interface TravelSpot {
  id: string;
  name: string;
  location: string;
  description: string;
  highlights: string[];
  reminders: string[];
  coordinates: {
    lat: string;
    lng: string;
  };
  imageUrl?: string;
  nightImageUrl?: string;
  prescription?: string;
}

export interface PostcardData {
  spot: TravelSpot;
  message: string;
  recipient: string;
  sender: string;
  prescription: string;
}

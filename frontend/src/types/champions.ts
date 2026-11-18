export interface Statistics {
  overall: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface Player {
  id: number;
  name: string;
  club: string;
  nationality: string;
  position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
  photo?: string;
  statistics: Statistics;
}

export interface Club {
  id: number;
  name: string;
  country: string;
  logo?: string;
}

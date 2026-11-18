export interface StatisticsModel {
  overall: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface PlayerModel {
  id: number;
  name: string;
  club: string;
  nationality: string;
  position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
  photo?: string;
  statistics: StatisticsModel;
}

import fs from "fs/promises";
import path from "path";
import type { PlayerModel, StatisticsModel } from "../models/player-model";

const filePath = path.join(__dirname, "../data/players.json");

async function readPlayersFile(): Promise<PlayerModel[]> {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

async function writePlayersFile(players: PlayerModel[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(players, null, 2), "utf-8");
}

export const findAllPlayers = async (): Promise<PlayerModel[]> => {
  return readPlayersFile();
};

export const findPlayerById = async (
  id: number,
): Promise<PlayerModel | undefined> => {
  const players = await readPlayersFile();
  return players.find((player) => player.id === id);
};

export const insertPlayer = async (player: PlayerModel): Promise<void> => {
  const players = await readPlayersFile();
  players.push(player);
  await writePlayersFile(players);
};

export const deleteOnePlayer = async (id: number): Promise<boolean> => {
  const players = await readPlayersFile();
  const index = players.findIndex((player) => player.id === id);
  if (index === -1) return false;

  players.splice(index, 1);
  await writePlayersFile(players);
  return true;
};

export const findAndModifyPlayer = async (
  id: number,
  statistics: StatisticsModel,
): Promise<PlayerModel | undefined> => {
  const players = await readPlayersFile();
  const playerIndex = players.findIndex((player) => player.id === id);
  if (playerIndex === -1) return undefined;

  players[playerIndex].statistics = statistics;
  await writePlayersFile(players);
  return players[playerIndex];
};

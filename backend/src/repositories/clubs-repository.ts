import fs from "fs/promises";
import path from "path";
import type { ClubModel } from "../models/club-model";

const filePath = path.join(__dirname, "../data/clubs.json");

async function readClubsFile(): Promise<ClubModel[]> {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
}

async function writeClubsFile(clubs: ClubModel[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(clubs, null, 2), "utf-8");
}

export const findAllClubs = async (): Promise<ClubModel[]> => {
  return readClubsFile();
};

export const insertClub = async (club: ClubModel): Promise<void> => {
  const clubs = await readClubsFile();
  clubs.push(club);
  await writeClubsFile(clubs);
};

export const deleteOneClub = async (id: number): Promise<boolean> => {
  const clubs = await readClubsFile();
  const index = clubs.findIndex((c) => c.id === id);
  if (index === -1) return false;

  clubs.splice(index, 1);
  await writeClubsFile(clubs);
  return true;
};

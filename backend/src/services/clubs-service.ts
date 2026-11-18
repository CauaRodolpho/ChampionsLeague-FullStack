import type { HttpResponse } from "../models/http-response-model";
import type { ClubModel } from "../models/club-model";
import * as ClubRepository from "../repositories/clubs-repository";

async function fetchClubBadge(clubName: string): Promise<string> {
  try {
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(clubName)}`,
    );
    const data = await response.json();
    return data?.teams?.[0]?.strBadge || "";
  } catch {
    return "";
  }
}

export const getClubService = async (): Promise<HttpResponse> => {
  const data = await ClubRepository.findAllClubs();
  if (!data || data.length === 0) {
    return { statusCode: 204, body: null };
  }
  return { statusCode: 200, body: data };
};

export const createClubService = async (
  club: ClubModel,
): Promise<HttpResponse> => {
  if (!club || !club.name || !club.country) {
    return {
      statusCode: 400,
      body: { message: "Informe o nome (name) e o país (country) do clube." },
    };
  }

  const allClubs = await ClubRepository.findAllClubs();
  const nextId =
    allClubs.length > 0 ? Math.max(...allClubs.map((c) => c.id)) + 1 : 1;
  const logo = club.logo || (await fetchClubBadge(club.name));

  const newClub: ClubModel = {
    id: nextId,
    name: club.name,
    country: club.country,
    logo,
  };

  await ClubRepository.insertClub(newClub);
  return { statusCode: 201, body: newClub };
};

export const deleteClubService = async (id: number): Promise<HttpResponse> => {
  const isDeleted = await ClubRepository.deleteOneClub(id);
  if (!isDeleted) {
    return { statusCode: 404, body: { message: "Clube não encontrado." } };
  }
  return { statusCode: 200, body: { message: "Clube removido com sucesso." } };
};

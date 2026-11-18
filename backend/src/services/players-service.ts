import type { HttpResponse } from "../models/http-response-model";
import type { PlayerModel, StatisticsModel } from "../models/player-model";
import * as PlayerRepository from "../repositories/players-repository";

function removeAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function fetchPlayerPhoto(playerName: string): Promise<string> {
  try {
    const cleanName = removeAccents(playerName);
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(cleanName)}`,
    );
    const data = await response.json();
    const playersList = data?.player || [];

    const soccerPlayer =
      playersList.find(
        (p: any) => p.strSport === "Soccer" && (p.strCutout || p.strThumb),
      ) || playersList[0];

    return (
      soccerPlayer?.strCutout ||
      soccerPlayer?.strThumb ||
      soccerPlayer?.strRender ||
      ""
    );
  } catch {
    return "";
  }
}

export const getPlayerService = async (): Promise<HttpResponse> => {
  const data = await PlayerRepository.findAllPlayers();
  if (!data || data.length === 0) {
    return { statusCode: 204, body: null };
  }

  for (const player of data) {
    if (!player.photo) {
      const fetchedPhoto = await fetchPlayerPhoto(player.name);
      if (fetchedPhoto) {
        player.photo = fetchedPhoto;
        await PlayerRepository.updateFullPlayer(player.id, player);
      }
    }
  }

  return { statusCode: 200, body: data };
};

export const getPlayerByIdService = async (
  id: number,
): Promise<HttpResponse> => {
  const data = await PlayerRepository.findPlayerById(id);
  if (!data) {
    return { statusCode: 404, body: { message: "Jogador não encontrado." } };
  }
  return { statusCode: 200, body: data };
};

export const createPlayerService = async (
  player: Omit<PlayerModel, "id">,
): Promise<HttpResponse> => {
  if (!player || !player.name || !player.club) {
    return {
      statusCode: 400,
      body: { message: "Dados inválidos para criar jogador." },
    };
  }

  const allPlayers = await PlayerRepository.findAllPlayers();
  const nextId =
    allPlayers.length > 0 ? Math.max(...allPlayers.map((p) => p.id)) + 1 : 1;
  const photo = player.photo || (await fetchPlayerPhoto(player.name));

  const newPlayer: PlayerModel = {
    id: nextId,
    name: player.name,
    club: player.club,
    nationality: player.nationality,
    position: player.position,
    photo,
    statistics: player.statistics,
  };

  await PlayerRepository.insertPlayer(newPlayer);
  return { statusCode: 201, body: newPlayer };
};

export const updatePlayerService = async (
  id: number,
  statistics: StatisticsModel,
): Promise<HttpResponse> => {
  const data = await PlayerRepository.findAndModifyPlayer(id, statistics);
  if (!data) {
    return { statusCode: 404, body: { message: "Jogador não encontrado." } };
  }
  return { statusCode: 200, body: data };
};

export const updateFullPlayerService = async (
  id: number,
  body: Omit<PlayerModel, "id">,
): Promise<HttpResponse> => {
  const photo = body.photo || (await fetchPlayerPhoto(body.name));
  const updated = await PlayerRepository.updateFullPlayer(id, {
    ...body,
    photo,
  });
  if (!updated) {
    return { statusCode: 404, body: { message: "Jogador não encontrado." } };
  }
  return { statusCode: 200, body: updated };
};

export const deletePlayerService = async (
  id: number,
): Promise<HttpResponse> => {
  const isDeleted = await PlayerRepository.deleteOnePlayer(id);
  if (!isDeleted) {
    return { statusCode: 404, body: { message: "Jogador não encontrado." } };
  }
  return {
    statusCode: 200,
    body: { message: "Jogador removido com sucesso." },
  };
};

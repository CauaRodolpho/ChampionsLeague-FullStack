import type { Club, Player, Statistics } from "../types/champions";

const API_URL = "http://localhost:3333/api";

export const api = {
  async getPlayers(): Promise<Player[]> {
    const res = await fetch(`${API_URL}/players`);
    if (res.status === 204) return [];
    return res.json();
  },

  async getClubs(): Promise<Club[]> {
    const res = await fetch(`${API_URL}/clubs`);
    if (res.status === 204) return [];
    return res.json();
  },

  async createPlayer(player: Omit<Player, "id">): Promise<Player> {
    const res = await fetch(`${API_URL}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
    });
    if (!res.ok) throw new Error("Erro ao cadastrar jogador");
    return res.json();
  },

  async updatePlayer(id: number, player: Omit<Player, "id">): Promise<Player> {
    const res = await fetch(`${API_URL}/players/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
    });
    if (!res.ok) throw new Error("Erro ao atualizar jogador");
    return res.json();
  },

  async updatePlayerStats(id: number, statistics: Statistics): Promise<Player> {
    const res = await fetch(`${API_URL}/players/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(statistics),
    });
    if (!res.ok) throw new Error("Erro ao atualizar estatísticas");
    return res.json();
  },

  async deletePlayer(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/players/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erro ao remover jogador");
  },

  async createClub(club: Omit<Club, "id">): Promise<Club> {
    const res = await fetch(`${API_URL}/clubs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(club),
    });
    if (!res.ok) throw new Error("Erro ao cadastrar clube");
    return res.json();
  },

  async deleteClub(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/clubs/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erro ao remover clube");
  },
};

import { useState } from "react";
import { Globe, Plus, Shield, Trash2, Users } from "lucide-react";
import type { Club, Player } from "../types/champions";

interface ClubsPageProps {
  clubs: Club[];
  players: Player[];
  onCreateClub: (data: Omit<Club, "id">) => Promise<void>;
  onDeleteClub: (id: number) => Promise<void>;
  onSelectClubToView: (clubName: string) => void;
}

export function ClubsPage({
  clubs,
  players,
  onCreateClub,
  onDeleteClub,
  onSelectClubToView,
}: ClubsPageProps) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !country.trim()) return;

    try {
      setSubmitting(true);
      await onCreateClub({ name: name.trim(), country: country.trim() });
      setName("");
      setCountry("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Formulário de Cadastro Rápido */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border border-indigo-500/30 bg-slate-900/70 p-5 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-400">
            Nome do Clube
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Borussia Dortmund"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-400">
            País
          </label>
          <input
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Ex: Germany"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 px-5 py-2 text-sm font-bold text-slate-950 shadow-lg transition hover:opacity-90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Adicionar Clube
        </button>
      </form>

      {/* Grid de Clubes */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club) => {
          const clubPlayers = players.filter((p) => p.club === club.name);
          const avgOverall =
            clubPlayers.length > 0
              ? Math.round(
                  clubPlayers.reduce(
                    (sum, p) => sum + p.statistics.overall,
                    0,
                  ) / clubPlayers.length,
                )
              : 0;

          return (
            <div
              key={club.id}
              className="flex flex-col justify-between rounded-2xl border border-indigo-500/25 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-lg transition hover:border-cyan-400/50"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/80 p-1.5 ring-1 ring-indigo-500/30">
                      {club.logo ? (
                        <img
                          src={club.logo}
                          alt={club.name}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <Shield className="h-5 w-5 text-cyan-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{club.name}</h3>
                      <p className="flex items-center gap-1 text-xs text-slate-400">
                        <Globe className="h-3 w-3" />
                        {club.country}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteClub(club.id)}
                    title="Remover clube"
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-red-950/70 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-4 border-t border-slate-800/80 pt-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-cyan-400" />
                    {clubPlayers.length}{" "}
                    {clubPlayers.length === 1 ? "jogador" : "jogadores"}
                  </span>
                  {avgOverall > 0 && (
                    <span className="rounded-md bg-amber-400/10 px-2 py-0.5 font-semibold text-amber-300">
                      OVR Médio: {avgOverall}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onSelectClubToView(club.name)}
                className="mt-4 w-full rounded-xl border border-slate-800 bg-slate-900/80 py-2 text-xs font-semibold text-cyan-300 transition hover:border-cyan-400/40 hover:bg-slate-800"
              >
                Ver elenco do clube →
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

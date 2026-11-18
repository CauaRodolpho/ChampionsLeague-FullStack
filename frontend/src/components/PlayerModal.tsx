import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Club, Player, Statistics } from "../types/champions";

interface PlayerModalProps {
  isOpen: boolean;
  clubs: Club[];
  editingPlayer: Player | null;
  onClose: () => void;
  onSaveNew: (data: Omit<Player, "id">) => Promise<void>;
  onSaveEdit: (id: number, data: Omit<Player, "id">) => Promise<void>;
}

const defaultStats: Statistics = {
  overall: 85,
  pace: 85,
  shooting: 82,
  passing: 80,
  dribbling: 84,
  defending: 60,
  physical: 78,
};

export function PlayerModal({
  isOpen,
  clubs,
  editingPlayer,
  onClose,
  onSaveNew,
  onSaveEdit,
}: PlayerModalProps) {
  const [name, setName] = useState("");
  const [club, setClub] = useState("");
  const [nationality, setNationality] = useState("");
  const [position, setPosition] = useState<Player["position"]>("Forward");
  const [photo, setPhoto] = useState("");
  const [stats, setStats] = useState<Statistics>(defaultStats);

  useEffect(() => {
    if (editingPlayer) {
      setName(editingPlayer.name);
      setClub(editingPlayer.club);
      setNationality(editingPlayer.nationality);
      setPosition(editingPlayer.position);
      setPhoto(editingPlayer.photo || "");
      setStats(editingPlayer.statistics);
    } else {
      setName("");
      setClub(clubs[0]?.name ?? "Real Madrid");
      setNationality("");
      setPosition("Forward");
      setPhoto("");
      setStats(defaultStats);
    }
  }, [editingPlayer, clubs, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Omit<Player, "id"> = {
      name,
      club,
      nationality,
      position,
      photo: photo.trim() || undefined,
      statistics: stats,
    };

    if (editingPlayer) {
      await onSaveEdit(editingPlayer.id, payload);
    } else {
      await onSaveNew(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg border border-white/15 bg-[#0E121B] p-6 text-white shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-sm font-bold tracking-wider text-white uppercase">
            {editingPlayer
              ? `Ficha Técnica — ${editingPlayer.name}`
              : "Registrar Novo Atleta"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">
              Nome Completo
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Rodrygo Goes"
              className="w-full border border-white/10 bg-[#07090E] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Clube Atual
              </label>
              <select
                value={club}
                onChange={(e) => setClub(e.target.value)}
                className="w-full border border-white/10 bg-[#07090E] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                {clubs.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Posição
              </label>
              <select
                value={position}
                onChange={(e) =>
                  setPosition(e.target.value as Player["position"])
                }
                className="w-full border border-white/10 bg-[#07090E] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Forward">Forward (Atacante)</option>
                <option value="Midfielder">Midfielder (Meia)</option>
                <option value="Defender">Defender (Defensor)</option>
                <option value="Goalkeeper">Goalkeeper (Goleiro)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                Nacionalidade
              </label>
              <input
                required
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="Ex: Brazil"
                className="w-full border border-white/10 bg-[#07090E] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-400">
                URL da Foto (Opcional)
              </label>
              <input
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                placeholder="Busca auto se vazio"
                className="w-full border border-white/10 bg-[#07090E] px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border border-white/10 bg-[#07090E] p-3.5">
            {(Object.keys(stats) as (keyof Statistics)[]).map((key) => (
              <div key={key}>
                <div className="flex justify-between text-xs tabular-nums">
                  <span className="text-[11px] font-semibold uppercase text-zinc-400">
                    {key}
                  </span>
                  <span className="font-bold text-blue-400">{stats[key]}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={99}
                  value={stats[key]}
                  onChange={(e) =>
                    setStats({ ...stats, [key]: Number(e.target.value) })
                  }
                  className="w-full accent-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 px-5 py-2 text-xs font-bold tracking-wider text-white uppercase hover:bg-blue-500"
            >
              {editingPlayer ? "Salvar Alterações" : "Cadastrar Atleta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

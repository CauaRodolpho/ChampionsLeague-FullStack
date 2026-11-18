import { useState } from "react";
import { Pencil, Trash2, Shield, Check, X, Scale } from "lucide-react";
import type { Club, Player } from "../types/champions";

interface PlayerCardProps {
  player: Player;
  clubs: Club[];
  isSelectedForCompare: boolean;
  onToggleCompare: (player: Player) => void;
  onEdit: (player: Player) => void;
  onDelete: (id: number) => void;
}

const positionShort: Record<Player["position"], string> = {
  Goalkeeper: "GK",
  Defender: "DEF",
  Midfielder: "MID",
  Forward: "FWD",
};

export function PlayerCard({
  player,
  clubs = [],
  isSelectedForCompare,
  onToggleCompare,
  onEdit,
  onDelete,
}: PlayerCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { statistics } = player;

  const clubLogo = clubs?.find((c) => c.name === player.club)?.logo;
  const initials = player.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div
      className={`group flex flex-col justify-between border bg-[#0E121B] p-5 text-white transition-colors ${
        isSelectedForCompare
          ? "border-blue-500 bg-blue-950/10"
          : "border-white/10 hover:border-white/25"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Overall Técnico */}
            <div className="flex h-12 w-12 flex-col items-center justify-center border border-white/15 bg-[#07090E] tabular-nums">
              <span className="text-xl font-black leading-none text-white">
                {statistics.overall}
              </span>
              <span className="mt-0.5 text-[10px] font-bold tracking-widest text-blue-400">
                {positionShort[player.position]}
              </span>
            </div>

            {/* Foto ou Iniciais */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-white/10 bg-zinc-900">
              {player.photo && !imgError ? (
                <img
                  src={player.photo}
                  alt={player.name}
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <span className="text-xs font-bold tracking-wider text-zinc-400">
                  {initials}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-base font-bold tracking-tight text-white">
                {player.name}
              </h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-400">
                {clubLogo && !logoError ? (
                  <img
                    src={clubLogo}
                    alt={player.club}
                    onError={() => setLogoError(true)}
                    className="h-3.5 w-3.5 object-contain"
                  />
                ) : (
                  <Shield className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                )}
                <span className="truncate text-zinc-300">{player.club}</span>
                <span>•</span>
                <span className="truncate">{player.nationality}</span>
              </p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-1">
            {confirmDelete ? (
              <div className="flex items-center gap-1 border border-red-500/40 bg-red-950/80 p-1">
                <button
                  onClick={() => onDelete(player.id)}
                  className="p-1 text-red-400 hover:bg-red-900/50"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="p-1 text-zinc-300 hover:bg-zinc-800"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onToggleCompare(player)}
                  title="Selecionar para comparação 1v1"
                  className={`p-1.5 transition ${
                    isSelectedForCompare
                      ? "bg-blue-600 text-white"
                      : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                  }`}
                >
                  <Scale className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit(player)}
                  title="Editar jogador / Transferir clube"
                  className="p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  title="Remover jogador"
                  className="p-1.5 text-zinc-500 transition hover:bg-red-950/60 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Grade de Atributos */}
        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-xs tabular-nums">
          <StatCell label="PAC" value={statistics.pace} />
          <StatCell label="SHO" value={statistics.shooting} />
          <StatCell label="PAS" value={statistics.passing} />
          <StatCell label="DRI" value={statistics.dribbling} />
          <StatCell label="DEF" value={statistics.defending} />
          <StatCell label="PHY" value={statistics.physical} />
        </div>
      </div>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: number }) {
  const highlight =
    value >= 90
      ? "text-emerald-400"
      : value >= 80
        ? "text-white"
        : "text-zinc-400";
  return (
    <div className="flex items-center justify-between border border-white/5 bg-[#07090E] px-2.5 py-1.5">
      <span className="text-[11px] font-semibold tracking-wider text-zinc-500">
        {label}
      </span>
      <span className={`font-bold ${highlight}`}>{value}</span>
    </div>
  );
}

import { X, Trophy } from "lucide-react";
import type { Club, Player, Statistics } from "../types/champions";

interface CompareModalProps {
  players: Player[];
  clubs: Club[];
  onClose: () => void;
}

const statLabels: { key: keyof Statistics; label: string }[] = [
  { key: "overall", label: "OVERALL" },
  { key: "pace", label: "VELOCIDADE (PAC)" },
  { key: "shooting", label: "FINALIZAÇÃO (SHO)" },
  { key: "passing", label: "PASSE (PAS)" },
  { key: "dribbling", label: "DRIBLE (DRI)" },
  { key: "defending", label: "DEFESA (DEF)" },
  { key: "physical", label: "FÍSICO (PHY)" },
];

export function CompareModal({ players, clubs, onClose }: CompareModalProps) {
  if (players.length !== 2) return null;
  const [p1, p2] = players;

  const p1Logo = clubs.find((c) => c.name === p1.club)?.logo;
  const p2Logo = clubs.find((c) => c.name === p2.club)?.logo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl border border-white/15 bg-[#0E121B] p-6 text-white shadow-2xl">
        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-blue-400 uppercase">
            <Trophy className="h-4 w-4" />
            Análise Comparativa Head-to-Head
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cabeçalho dos 2 Jogadores */}
        <div className="mb-6 grid grid-cols-3 items-center text-center">
          <div className="flex flex-col items-center">
            {p1Logo && (
              <img
                src={p1Logo}
                alt={p1.club}
                className="mb-2 h-8 w-8 object-contain"
              />
            )}
            <h3 className="text-base font-bold">{p1.name}</h3>
            <span className="text-xs text-zinc-400">{p1.club}</span>
          </div>

          <div className="text-xs font-black tracking-widest text-zinc-500">
            VS
          </div>

          <div className="flex flex-col items-center">
            {p2Logo && (
              <img
                src={p2Logo}
                alt={p2.club}
                className="mb-2 h-8 w-8 object-contain"
              />
            )}
            <h3 className="text-base font-bold">{p2.name}</h3>
            <span className="text-xs text-zinc-400">{p2.club}</span>
          </div>
        </div>

        {/* Comparação Atributo por Atributo */}
        <div className="space-y-3">
          {statLabels.map(({ key, label }) => {
            const v1 = p1.statistics[key];
            const v2 = p2.statistics[key];
            const p1Wins = v1 > v2;
            const p2Wins = v2 > v1;

            return (
              <div key={key} className="border border-white/5 bg-[#07090E] p-3">
                <div className="mb-1.5 flex items-center justify-between text-xs tabular-nums">
                  <span
                    className={`font-bold ${p1Wins ? "text-emerald-400" : "text-zinc-400"}`}
                  >
                    {v1} {p1Wins && `(+${v1 - v2})`}
                  </span>
                  <span className="text-[11px] font-semibold tracking-wider text-zinc-400">
                    {label}
                  </span>
                  <span
                    className={`font-bold ${p2Wins ? "text-emerald-400" : "text-zinc-400"}`}
                  >
                    {p2Wins && `(+${v2 - v1})`} {v2}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div className="flex justify-end bg-zinc-900">
                    <div
                      className={`h-1.5 ${p1Wins ? "bg-emerald-500" : "bg-blue-600/60"}`}
                      style={{ width: `${v1}%` }}
                    />
                  </div>
                  <div className="bg-zinc-900">
                    <div
                      className={`h-1.5 ${p2Wins ? "bg-emerald-500" : "bg-blue-600/60"}`}
                      style={{ width: `${v2}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

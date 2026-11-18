import { useEffect, useState } from "react";
import { ArrowUpDown, Plus, Search, Scale, X } from "lucide-react";
import { api } from "./services/api";
import type { Club, Player } from "./types/champions";
import { PlayerCard } from "./components/PlayerCard";
import { PlayerModal } from "./components/PlayerModal";
import { ClubsPage } from "./pages/ClubsPage";
import { CompareModal } from "./components/CompareModal";

export function App() {
  const [activePage, setActivePage] = useState<"players" | "clubs">("players");
  const [players, setPlayers] = useState<Player[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<string>("ALL");
  const [selectedPosition, setSelectedPosition] = useState<string>("ALL");
  const [sortByOverall, setSortByOverall] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const [compareList, setCompareList] = useState<Player[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [playersData, clubsData] = await Promise.all([
        api.getPlayers(),
        api.getClubs(),
      ]);
      setPlayers(Array.isArray(playersData) ? playersData : []);
      setClubs(Array.isArray(clubsData) ? clubsData : []);
    } catch (error) {
      console.error("Erro ao carregar dados da API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleCompare = (player: Player) => {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === player.id);
      if (exists) return prev.filter((p) => p.id !== player.id);
      if (prev.length >= 2) return [prev[1], player];
      return [...prev, player];
    });
  };

  const handleCreatePlayer = async (data: Omit<Player, "id">) => {
    const created = await api.createPlayer(data);
    setPlayers((prev) => [...prev, created]);
    showToast(`${created.name} registrado no elenco.`);
  };

  const handleUpdatePlayer = async (id: number, data: Omit<Player, "id">) => {
    const updated = await api.updatePlayer(id, data);
    setPlayers((prev) => prev.map((p) => (p.id === id ? updated : p)));
    showToast(`Dados de ${updated.name} atualizados.`);
  };

  const handleDeletePlayer = async (id: number) => {
    await api.deletePlayer(id);
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setCompareList((prev) => prev.filter((p) => p.id !== id));
    showToast("Atleta removido.");
  };

  const handleCreateClub = async (data: Omit<Club, "id">) => {
    const created = await api.createClub(data);
    setClubs((prev) => [...prev, created]);
    showToast(`${created.name} adicionado à liga.`);
  };

  const handleDeleteClub = async (id: number) => {
    await api.deleteClub(id);
    setClubs((prev) => prev.filter((c) => c.id !== id));
    showToast("Clube removido.");
  };

  const filteredPlayers = players
    .filter((player) => {
      const matchesClub =
        selectedClub === "ALL" || player.club === selectedClub;
      const matchesPosition =
        selectedPosition === "ALL" || player.position === selectedPosition;
      const matchesSearch =
        player.name.toLowerCase().includes(search.toLowerCase()) ||
        player.nationality.toLowerCase().includes(search.toLowerCase());
      return matchesClub && matchesPosition && matchesSearch;
    })
    .sort((a, b) =>
      sortByOverall ? b.statistics.overall - a.statistics.overall : a.id - b.id,
    );

  const avgOverall =
    players.length > 0
      ? Math.round(
          players.reduce((acc, p) => acc + p.statistics.overall, 0) /
            players.length,
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#07090E] text-white selection:bg-blue-600 selection:text-white">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 border border-white/15 bg-[#0E121B] px-4 py-3 text-xs font-semibold tracking-wide text-white shadow-2xl">
          {toast}
        </div>
      )}

      {/* Barra Flutuante de Comparação 1v1 */}
      {compareList.length > 0 && (
        <div className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 border border-blue-500/50 bg-[#0E121B] px-5 py-3 shadow-2xl">
          <div className="flex items-center gap-2 text-xs">
            <Scale className="h-4 w-4 text-blue-400" />
            <span className="font-semibold text-zinc-300">
              {compareList.map((p) => p.name).join(" vs ")}
            </span>
            {compareList.length === 1 && (
              <span className="text-zinc-500">(selecione +1 atleta)</span>
            )}
          </div>

          {compareList.length === 2 && (
            <button
              onClick={() => setIsCompareOpen(true)}
              className="bg-blue-600 px-3 py-1.5 text-xs font-bold tracking-wider uppercase hover:bg-blue-500"
            >
              Comparar Agora
            </button>
          )}

          <button
            onClick={() => setCompareList([])}
            className="text-zinc-500 hover:text-white"
            title="Limpar seleção"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Topbar Editorial */}
      <header className="border-b border-white/10 bg-[#0E121B]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 bg-blue-600" />
            <div>
              <h1 className="text-lg font-black tracking-tight uppercase">
                UCL Scouting & Data Hub
              </h1>
              <p className="text-[11px] tracking-wider text-zinc-500 uppercase">
                Champions League Management System
              </p>
            </div>
          </div>

          <nav className="flex items-center border border-white/10 bg-[#07090E]">
            <button
              onClick={() => setActivePage("players")}
              className={`px-4 py-2 text-xs font-bold tracking-wider uppercase transition ${
                activePage === "players"
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Atletas ({players.length})
            </button>
            <button
              onClick={() => setActivePage("clubs")}
              className={`px-4 py-2 text-xs font-bold tracking-wider uppercase transition ${
                activePage === "clubs"
                  ? "bg-blue-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Clubes ({clubs.length})
            </button>
          </nav>

          {activePage === "players" && (
            <button
              onClick={() => {
                setEditingPlayer(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-blue-600 px-4 py-2 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-blue-500"
            >
              <Plus className="h-4 w-4" />
              Novo Atleta
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Painel de Indicadores */}
        <div className="mb-8 grid grid-cols-3 border border-white/10 bg-[#0E121B] tabular-nums">
          <div className="border-r border-white/10 p-4">
            <p className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
              Base de Atletas
            </p>
            <p className="mt-1 text-2xl font-black">{players.length}</p>
          </div>
          <div className="border-r border-white/10 p-4">
            <p className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
              Rating Médio
            </p>
            <p className="mt-1 text-2xl font-black text-blue-400">
              {avgOverall}
            </p>
          </div>
          <div className="p-4">
            <p className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
              Clubes Ativos
            </p>
            <p className="mt-1 text-2xl font-black">{clubs.length}</p>
          </div>
        </div>

        {activePage === "clubs" ? (
          <ClubsPage
            clubs={clubs}
            players={players}
            onCreateClub={handleCreateClub}
            onDeleteClub={handleDeleteClub}
            onSelectClubToView={(clubName) => {
              setSelectedClub(clubName);
              setActivePage("players");
            }}
          />
        ) : (
          <>
            {/* Filtros Técnicos */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1">
                {["ALL", "Forward", "Midfielder", "Defender", "Goalkeeper"].map(
                  (pos) => (
                    <button
                      key={pos}
                      onClick={() => setSelectedPosition(pos)}
                      className={`border px-3 py-1.5 text-xs font-semibold transition ${
                        selectedPosition === pos
                          ? "border-blue-500 bg-blue-600/20 text-blue-400"
                          : "border-white/10 bg-[#0E121B] text-zinc-400 hover:text-white"
                      }`}
                    >
                      {pos === "ALL" ? "Todas Posições" : pos}
                    </button>
                  ),
                )}
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <button
                  onClick={() => setSortByOverall(!sortByOverall)}
                  className="flex items-center gap-1.5 border border-white/10 bg-[#0E121B] px-3 py-2 text-xs font-semibold text-zinc-300 hover:border-white/25"
                >
                  <ArrowUpDown className="h-3.5 w-3.5 text-blue-400" />
                  {sortByOverall ? "Rating ↓" : "ID ↑"}
                </button>

                <div className="relative flex-1 sm:w-60">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Filtrar atleta ou país..."
                    className="w-full border border-white/10 bg-[#0E121B] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Filtro por Clubes */}
            <div className="mb-8 flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedClub("ALL")}
                className={`border px-3 py-1.5 text-xs font-semibold transition ${
                  selectedClub === "ALL"
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-[#0E121B] text-zinc-400 hover:text-white"
                }`}
              >
                Todos Clubes
              </button>
              {clubs.map((club) => (
                <button
                  key={club.id}
                  onClick={() => setSelectedClub(club.name)}
                  className={`flex items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold transition ${
                    selectedClub === club.name
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-[#0E121B] text-zinc-400 hover:text-white"
                  }`}
                >
                  {club.logo && (
                    <img
                      src={club.logo}
                      alt={club.name}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="h-3.5 w-3.5 object-contain"
                    />
                  )}
                  {club.name}
                </button>
              ))}
            </div>

            {/* Grid */}
            {loading ? (
              <p className="py-12 text-center text-xs tracking-wider text-zinc-500 uppercase">
                Sincronizando dados...
              </p>
            ) : filteredPlayers.length === 0 ? (
              <p className="py-12 text-center text-xs tracking-wider text-zinc-500 uppercase">
                Nenhum registro encontrado.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPlayers.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    clubs={clubs}
                    isSelectedForCompare={compareList.some(
                      (p) => p.id === player.id,
                    )}
                    onToggleCompare={handleToggleCompare}
                    onEdit={(p) => {
                      setEditingPlayer(p);
                      setIsModalOpen(true);
                    }}
                    onDelete={handleDeletePlayer}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <PlayerModal
        isOpen={isModalOpen}
        clubs={clubs}
        editingPlayer={editingPlayer}
        onClose={() => setIsModalOpen(false)}
        onSaveNew={handleCreatePlayer}
        onSaveEdit={handleUpdatePlayer}
      />

      {isCompareOpen && (
        <CompareModal
          players={compareList}
          clubs={clubs}
          onClose={() => setIsCompareOpen(false)}
        />
      )}
    </div>
  );
}

export default App;

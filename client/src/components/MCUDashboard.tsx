import { useState, useEffect } from "react";
import MCUCard from "./MCUCard";
import SortControl from "./SortControl";
import { useWatchedState } from "@/hooks/useWatchedState";
import type { MCUProduction, SortBy } from "@/types/mcu";

export default function MCUDashboard() {
  const [productions, setProductions] = useState<MCUProduction[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("chronology");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isWatched, toggleWatched } = useWatchedState();

  // Carregar dados do JSON
  useEffect(() => {
    const loadProductions = async () => {
      try {
        setLoading(true);
        const response = await fetch("/mcu_productions.json");
        if (!response.ok) {
          throw new Error("Falha ao carregar dados do MCU");
        }
        const data = await response.json();
        setProductions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar produções"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProductions();
  }, []);

  // Ordenar produções
  const sortedProductions = [...productions].sort((a, b) => {
    if (sortBy === "chronology") {
      return a.chronology_order - b.chronology_order;
    } else {
      return a.release_order - b.release_order;
    }
  });

  // Agrupar por fase
  const groupedByPhase = sortedProductions.reduce(
    (acc, production) => {
      if (!acc[production.phase]) {
        acc[production.phase] = [];
      }
      acc[production.phase].push(production);
      return acc;
    },
    {} as Record<string, MCUProduction[]>
  );

  // Ordenar fases
  const phaseOrder = [
    "Fase 1",
    "Fase 2",
    "Fase 3",
    "Fase 4",
    "Fase 5",
    "Fase 6",
  ];
  const sortedPhases = Object.keys(groupedByPhase).sort(
    (a, b) => phaseOrder.indexOf(a) - phaseOrder.indexOf(b)
  );

  // Calcular estatísticas
  const totalProductions = productions.length;
  const watchedCount = productions.filter((p) => isWatched(p.title)).length;
  const watchedPercentage =
    totalProductions > 0
      ? Math.round((watchedCount / totalProductions) * 100)
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando produções do MCU...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">MCU Productions Dashboard</h1>
            <p className="text-muted-foreground">
              Explore todas as produções canônicas do Universo Cinematográfico Marvel
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-card p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold">{totalProductions}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Assistidas</p>
              <p className="text-2xl font-bold">{watchedCount}</p>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Progresso</p>
              <p className="text-2xl font-bold">{watchedPercentage}%</p>
            </div>
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">
              Ordenar por:
            </span>
            <SortControl currentSort={sortBy} onSortChange={setSortBy} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {sortedPhases.map((phase) => (
          <div key={phase} className="mb-12">
            {/* Phase Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{phase}</h2>
              <div className="h-1 w-20 bg-primary rounded-full"></div>
              <p className="text-sm text-muted-foreground mt-2">
                {groupedByPhase[phase].length} produções
              </p>
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {groupedByPhase[phase].map((production) => (
                <MCUCard
                  key={production.title}
                  production={production}
                  isWatched={isWatched(production.title)}
                  onToggleWatched={toggleWatched}
                />
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-muted border-t mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>MCU Productions Dashboard © 2024</p>
          <p className="mt-2">Dados atualizados até Fase 6 do MCU</p>
        </div>
      </footer>
    </div>
  );
}


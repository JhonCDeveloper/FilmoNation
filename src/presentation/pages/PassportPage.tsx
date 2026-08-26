import { useState, useMemo } from 'react';
import { usePassport } from '@/presentation/hooks/usePassport';
import { useDossiers } from '@/presentation/hooks/useDossiers';
import { useMultipleMovies } from '@/presentation/hooks/useMultipleMovies';
import { MovieCard } from '@/presentation/components/ui/movie-card';
import { MovieGridSkeleton } from '@/presentation/components/ui/movie-grid-skeleton';
import { DossierCard } from '@/presentation/components/feature/DossierCard';
import { CreateDossierModal } from '@/presentation/components/feature/CreateDossierModal';
import { StateEmpty } from '@/presentation/components/ui/state-empty';
import { Clock, Stamp, Bookmark, Plus, ChevronLeft, X } from 'lucide-react';
import type { TmdbMovieDetailsResponse } from '@/infrastructure/api/types';

type Tab = 'all' | 'stamped' | 'watchlist' | 'dossiers';

export default function PassportPage() {
  const { passport } = usePassport();
  const { dossiers, createDossier, removeDossier, removeMovieFromDossier } = useDossiers();

  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDossierId, setSelectedDossierId] = useState<string | null>(null);

  // --- Metrics Calculation ---
  const totalWatchedMinutes = useMemo(() => {
    let total = 0;
    for (const id of passport.stampedMovieIds) {
      if (passport.moviesMetadata[id]?.runtime) {
        total += passport.moviesMetadata[id].runtime;
      }
    }
    return total;
  }, [passport.stampedMovieIds, passport.moviesMetadata]);

  const hours = Math.floor(totalWatchedMinutes / 60);
  const minutes = totalWatchedMinutes % 60;

  // --- Movies Fetching ---
  const allRelevantMovieIds = useMemo(() => {
    const ids = new Set([...passport.stampedMovieIds, ...passport.watchlistMovieIds]);
    if (selectedDossierId) {
      const d = dossiers.find((x) => x.id === selectedDossierId);
      if (d) d.movieIds.forEach((id) => ids.add(id));
    }
    return Array.from(ids);
  }, [passport.stampedMovieIds, passport.watchlistMovieIds, selectedDossierId, dossiers]);

  const moviesQueries = useMultipleMovies(allRelevantMovieIds);
  const isLoadingMovies = moviesQueries.some((q) => q.isLoading);

  const getMoviesData = (ids: number[]) => {
    return ids
      .map((id) => moviesQueries.find((q) => q.data?.id === id)?.data)
      .filter((m): m is TmdbMovieDetailsResponse => !!m);
  };

  // --- Tab filtering ---
  let displayedMovies: TmdbMovieDetailsResponse[] = [];
  if (selectedDossierId) {
    const selectedDossier = dossiers.find((d) => d.id === selectedDossierId);
    displayedMovies = getMoviesData(selectedDossier?.movieIds ?? []);
  } else if (activeTab === 'all') {
    displayedMovies = getMoviesData([
      ...new Set([...passport.stampedMovieIds, ...passport.watchlistMovieIds]),
    ]);
  } else if (activeTab === 'stamped') {
    displayedMovies = getMoviesData(passport.stampedMovieIds);
  } else if (activeTab === 'watchlist') {
    displayedMovies = getMoviesData(passport.watchlistMovieIds);
  }

  // --- Render Helpers ---
  const renderEmptyState = () => {
    if (selectedDossierId) {
      return (
        <StateEmpty
          title="Expediente Vacío"
          message="Aún no has asignado películas a este expediente. Explora el territorio y añádelas desde la ficha de cada película."
          actionLabel="Explorar Territorio"
        />
      );
    }
    if (activeTab === 'dossiers' && dossiers.length === 0) {
      return (
        <StateEmpty
          title="Sin Expedientes"
          message="Crea listas personalizadas para agrupar películas por temáticas, géneros o como prefieras."
          onAction={() => {
            setIsModalOpen(true);
          }}
          actionLabel="Nuevo Expediente"
        />
      );
    }
    return (
      <StateEmpty
        title="Páginas en Blanco"
        message="Tu libreta consular aún no tiene registros aquí. Adéntrate en el territorio y comienza a sellar tu pasaporte."
        actionLabel="Explorar Territorio"
      />
    );
  };

  const selectedDossier = selectedDossierId
    ? dossiers.find((d) => d.id === selectedDossierId)
    : null;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-12 animate-in fade-in duration-500">
      {/* Top Panel - Metrics */}
      {!selectedDossierId && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface-raised border border-line rounded-2xl p-6 flex items-center gap-5">
            <div className="p-3 bg-brand/10 text-brand rounded-xl">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-sm font-mono text-ink-muted mb-1">Tiempo de Visualización</p>
              <p className="text-2xl font-display font-bold text-ink">
                {hours}h {minutes}m
              </p>
            </div>
          </div>

          <div className="bg-surface-raised border border-line rounded-2xl p-6 flex items-center gap-5">
            <div className="p-3 bg-brand/10 text-brand rounded-xl">
              <Stamp size={28} />
            </div>
            <div>
              <p className="text-sm font-mono text-ink-muted mb-1">Pasaportes Sellados</p>
              <p className="text-2xl font-display font-bold text-ink">
                {passport.stampedMovieIds.length}
              </p>
            </div>
          </div>

          <div className="bg-surface-raised border border-line rounded-2xl p-6 flex items-center gap-5">
            <div className="p-3 bg-brand/10 text-brand rounded-xl">
              <Bookmark size={28} />
            </div>
            <div>
              <p className="text-sm font-mono text-ink-muted mb-1">Visas Pendientes</p>
              <p className="text-2xl font-display font-bold text-ink">
                {passport.watchlistMovieIds.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        {selectedDossierId ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedDossierId(null);
              }}
              className="p-2 hover:bg-surface-raised border border-transparent hover:border-line rounded-lg text-ink-muted hover:text-ink transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h2 className="text-2xl font-display font-bold text-brand">
                {selectedDossier?.title}
              </h2>
              {selectedDossier?.notes && (
                <p className="text-sm text-ink-muted">{selectedDossier.notes}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 border border-line rounded-xl p-1.5 bg-surface-raised">
            {[
              { id: 'all', label: 'Todo' },
              { id: 'stamped', label: 'Selladas' },
              { id: 'watchlist', label: 'Visas Pendientes' },
              { id: 'dossiers', label: 'Expedientes' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as Tab);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand/20 text-brand shadow-sm'
                    : 'text-ink-muted hover:text-ink hover:bg-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Action Button */}
        {!selectedDossierId && activeTab === 'dossiers' && (
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand text-surface rounded-xl text-sm font-bold hover:bg-brand/90 transition-colors shadow-sm active:scale-95"
          >
            <Plus size={16} />
            Crear Expediente
          </button>
        )}
      </div>

      {/* Content Grid */}
      {selectedDossierId || activeTab !== 'dossiers' ? (
        <div className="min-h-[400px]">
          {isLoadingMovies ? (
            <MovieGridSkeleton count={8} />
          ) : displayedMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
              {displayedMovies.map((movie) => (
                <div key={movie.id} className="relative group">
                  <MovieCard movie={{ ...movie, genre_ids: movie.genres.map((g) => g.id) }} />
                  {selectedDossierId && (
                    <button
                      onClick={() => {
                        removeMovieFromDossier(selectedDossierId, movie.id);
                      }}
                      className="absolute top-2 left-2 z-10 p-2 bg-danger/90 text-surface rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger shadow-md"
                      title="Quitar de este expediente"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            renderEmptyState()
          )}
        </div>
      ) : (
        /* Dossiers Grid */
        <div className="min-h-[400px]">
          {dossiers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {dossiers.map((dossier) => (
                <button
                  key={dossier.id}
                  type="button"
                  onClick={() => {
                    setSelectedDossierId(dossier.id);
                  }}
                  className="cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-brand rounded-xl"
                >
                  <DossierCard
                    dossier={dossier}
                    onDelete={(id) => {
                      if (window.confirm('¿Seguro que deseas eliminar este expediente?')) {
                        removeDossier(id);
                      }
                    }}
                  />
                </button>
              ))}
            </div>
          ) : (
            renderEmptyState()
          )}
        </div>
      )}

      <CreateDossierModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onSubmit={createDossier}
      />
    </div>
  );
}

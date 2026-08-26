import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router';
import { Search, Loader2 } from 'lucide-react';
import { useSearchMovies } from '@/presentation/hooks/useMovies';
import { useDebounce } from '@/presentation/hooks/useDebounce';
import { useOnClickOutside } from '@/presentation/hooks/useOnClickOutside';
import { getTmdbImageUrl } from '@/shared/utils/image-url';
import { fmtYear, fmtRating } from '@/shared/i18n/formatters';
import { UI } from '@/shared/i18n/messages';

export function HeaderSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const isTerritory = location.pathname === '/territorio';
  const urlQuery = searchParams.get('q') ?? '';

  // Estado local para input fluido (bidireccional con URL)
  const [query, setQuery] = useState(urlQuery);

  // 1. Sync URL -> Input (si el usuario recarga, navega atrás o usa los filtros)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(urlQuery);
  }, [urlQuery]);

  const debouncedQuery = useDebounce(query, 350);
  const isSearchActive = debouncedQuery.trim().length >= 2;

  // 2. Sync Input -> URL (Solo en territorio, reactivo)
  useEffect(() => {
    if (isTerritory && debouncedQuery !== urlQuery) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (debouncedQuery.trim()) {
            next.set('q', debouncedQuery.trim());
          } else {
            next.delete('q');
          }
          next.set('page', '1'); // Reiniciar paginación al buscar
          return next;
        },
        { replace: true },
      );
    }
  }, [debouncedQuery, isTerritory, urlQuery, setSearchParams]);

  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useSearchMovies({
    query: debouncedQuery,
  }); // se deshabilita automáticamente si query está vacío en el hook

  useOnClickOutside(containerRef, () => {
    setIsOpen(false);
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!isTerritory && e.target.value.trim().length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim().length > 0) {
        setIsOpen(false);
        void navigate(`/territorio?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleFocus = () => {
    if (!isTerritory && query.trim().length >= 2) {
      setIsOpen(true);
    }
  };

  const handleResultClick = (id: number) => {
    setIsOpen(false);
    setQuery('');
    void navigate(`/movie/${String(id)}`);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    void navigate(`/territorio?q=${encodeURIComponent(query.trim())}`);
  };

  const results = data?.results.slice(0, 5) ?? [];
  // Supresión Condicional del Menú Desplegable en /territorio
  const showDropdown = isOpen && isSearchActive && !isTerritory;

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted w-5 h-5 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        role="combobox"
        aria-expanded={showDropdown}
        aria-haspopup="listbox"
        aria-owns={showDropdown ? 'search-results-listbox' : undefined}
        aria-autocomplete="list"
        aria-controls={showDropdown ? 'search-results-listbox' : undefined}
        aria-label={UI.search.placeholder}
        placeholder={UI.search.placeholder}
        className="w-full pl-10 pr-10 py-2 border border-line bg-surface-raised rounded-full font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand text-ink placeholder:text-ink-muted/50 transition-shadow"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
      />

      {/* Indicador de carga dentro del input */}
      {isLoading && isSearchActive && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Loader2 className="w-4 h-4 text-brand animate-spin" aria-hidden="true" />
        </div>
      )}

      {/* Panel Flotante de Resultados */}
      {showDropdown && (
        <div
          id="search-results-listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-surface-raised border border-line rounded-xl shadow-xl overflow-hidden z-50 flex flex-col"
          role="listbox"
        >
          {results.length > 0 ? (
            <div className="flex flex-col">
              {results.map((movie) => {
                const year = movie.release_date ? fmtYear(movie.release_date) : UI.search.noData;
                const rating =
                  movie.vote_average > 0 ? fmtRating(movie.vote_average) : UI.search.noData;
                const posterUrl = getTmdbImageUrl(movie.poster_path, { size: 'w92' });

                return (
                  <button
                    key={movie.id}
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() => {
                      handleResultClick(movie.id);
                    }}
                    className="flex items-center gap-3 p-3 text-left hover:bg-line/50 focus:bg-line/50 outline-none transition-colors border-b border-line/50 last:border-0"
                  >
                    <div className="w-10 flex-shrink-0 aspect-[2/3] bg-panel rounded overflow-hidden">
                      {movie.poster_path ? (
                        <img
                          src={posterUrl}
                          alt=""
                          className="w-full h-full object-cover block"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ink-muted/30 text-[10px]">
                          ?
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="font-sans font-semibold text-sm text-ink truncate">
                        {movie.title}
                      </p>
                      <p className="font-mono text-[10px] text-ink-muted truncate">
                        {year} • ★ {rating}
                      </p>
                    </div>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={handleViewAll}
                className="p-3 text-center bg-line/20 hover:bg-line/40 font-mono text-xs font-bold text-brand uppercase tracking-wider transition-colors outline-none focus:bg-line/40"
              >
                {UI.search.viewAll}
              </button>
            </div>
          ) : (
            !isLoading && (
              <div className="p-4 text-center">
                <p className="font-sans text-sm text-ink-muted">{UI.search.noResults}</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

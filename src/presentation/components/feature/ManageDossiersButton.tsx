import { useState, useRef } from 'react';
import { useDossiers } from '@/presentation/hooks/useDossiers';
import { useOnClickOutside } from '@/presentation/hooks/useOnClickOutside';
import { FolderHeart, Check, Plus } from 'lucide-react';
import { Link } from 'react-router';

interface ManageDossiersButtonProps {
  movieId: number;
}

export function ManageDossiersButton({ movieId }: ManageDossiersButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { dossiers, addMovieToDossier, removeMovieFromDossier } = useDossiers();
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => {
    setIsOpen(false);
  });

  const toggleDossier = (dossierId: string, hasMovie: boolean) => {
    if (hasMovie) {
      removeMovieFromDossier(dossierId, movieId);
    } else {
      addMovieToDossier(dossierId, movieId);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="inline-flex items-center justify-center font-mono font-medium transition-all duration-200 cursor-pointer border select-none active:scale-95 px-5 py-2.5 text-base gap-2.5 rounded-xl bg-surface-raised text-ink-muted border-line hover:text-brand hover:border-brand/60 hover:bg-brand/10"
      >
        <FolderHeart className="w-5 h-5" />
        <span>Expedientes</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-64 bg-surface border border-line rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-line/50">
            <h4 className="text-xs font-mono text-ink-muted uppercase tracking-wider">
              Añadir a Expediente
            </h4>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {dossiers.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm text-ink-muted mb-3">No tienes expedientes creados.</p>
                <Link
                  to="/pasaporte"
                  className="inline-flex items-center gap-1.5 text-xs text-brand hover:underline"
                >
                  <Plus size={14} /> Ir a Pasaporte
                </Link>
              </div>
            ) : (
              <ul className="p-1.5">
                {dossiers.map((dossier) => {
                  const hasMovie = dossier.movieIds.includes(movieId);
                  return (
                    <li key={dossier.id}>
                      <button
                        onClick={() => {
                          toggleDossier(dossier.id, hasMovie);
                        }}
                        className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-surface-raised"
                      >
                        <span
                          className={`line-clamp-1 ${hasMovie ? 'text-brand font-medium' : 'text-ink'}`}
                        >
                          {dossier.title}
                        </span>
                        {hasMovie && <Check size={16} className="text-brand flex-shrink-0" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

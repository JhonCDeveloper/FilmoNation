import type { Dossier } from '@/infrastructure/storage/dossier-storage';
import { FolderHeart, Trash2, Calendar } from 'lucide-react';

interface DossierCardProps {
  dossier: Dossier;
  onDelete: (id: string) => void;
}

export function DossierCard({ dossier, onDelete }: DossierCardProps) {
  const formattedDate = new Date(dossier.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="group relative bg-surface-raised border border-line rounded-xl p-5 hover:border-brand/40 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Decorative bg element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />

      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-brand/10 text-brand rounded-lg">
          <FolderHeart size={24} strokeWidth={1.5} />
        </div>
        <button
          onClick={() => {
            onDelete(dossier.id);
          }}
          className="text-ink-muted hover:text-danger p-2 rounded-full hover:bg-danger/10 transition-colors opacity-0 group-hover:opacity-100"
          title="Eliminar Expediente"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <h3 className="text-xl font-display font-semibold text-parchment mb-2 line-clamp-1">
        {dossier.title}
      </h3>

      {dossier.notes ? (
        <p className="text-sm text-ink-muted line-clamp-2 mb-4 flex-grow">{dossier.notes}</p>
      ) : (
        <p className="text-sm text-ink-muted/50 italic mb-4 flex-grow">Sin notas consulares.</p>
      )}

      <div className="flex items-center justify-between text-xs text-ink-muted border-t border-line/50 pt-4 mt-auto">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>
        <div className="font-mono bg-surface px-2 py-1 rounded-md border border-line">
          {dossier.movieIds.length} {dossier.movieIds.length === 1 ? 'título' : 'títulos'}
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect, useCallback } from 'react';
import { useOnClickOutside } from '@/presentation/hooks/useOnClickOutside';
import { X } from 'lucide-react';

interface CreateDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, notes: string) => void;
}

export function CreateDossierModal({ isOpen, onClose, onSubmit }: CreateDossierModalProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const stableClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useOnClickOutside(modalRef, stableClose);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle('');

      setNotes('');

      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título es obligatorio.');
      return;
    }
    onSubmit(title.trim(), notes.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="bg-surface-raised border border-brand/30 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between p-5 border-b border-line/50">
          <h2 className="text-xl font-display text-brand font-semibold">Nuevo Expediente</h2>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-ink transition-colors rounded-full p-1 hover:bg-surface"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-ink-muted mb-1.5">
              Título de la Colección <span className="text-brand">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="Ej. Cine Noir Europeo, Obras Maestras..."
              className="w-full bg-surface border border-line rounded-lg px-4 py-2.5 text-ink focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/60 transition-colors"
            />
            {error && <p className="text-danger text-xs mt-1.5">{error}</p>}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-ink-muted mb-1.5">
              Notas Consulares (Opcional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
              }}
              placeholder="Propósito u observaciones de este expediente..."
              rows={3}
              className="w-full bg-surface border border-line rounded-lg px-4 py-2.5 text-ink focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/60 transition-colors resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-brand/20 text-brand border border-brand/50 hover:bg-brand/30 transition-colors"
            >
              Emitir Expediente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { HttpError } from '@/infrastructure/http/http-error';

export interface StateErrorProps {
  error: Error | null;
  onRetry?: (() => void) | undefined;
  title?: string | undefined;
}

export function StateError({ error, onRetry, title }: StateErrorProps) {
  // Configuración por defecto
  let icon = <AlertTriangle className="w-10 h-10 text-danger" />;
  let heading = title ?? 'Ha ocurrido un error inesperado';
  let message = 'No pudimos procesar la solicitud en este momento. Por favor, intenta de nuevo.';

  // Parseo inteligente si es un HttpError
  if (error instanceof HttpError) {
    switch (error.type) {
      case 'RATE_LIMIT':
        heading = 'Tráfico Elevado';
        message =
          'El Archivo Nacional (TMDB) está recibiendo demasiadas consultas. Espera un momento antes de reintentar.';
        break;
      case 'NETWORK_ERROR':
        icon = <WifiOff className="w-10 h-10 text-danger" />;
        heading = 'Error de Conexión';
        message = 'No logramos contactar al servidor. Comprueba tu conexión a internet.';
        break;
      case 'NOT_FOUND':
        heading = 'Recurso No Encontrado';
        message =
          'El expediente o la información que solicitas ya no está disponible en la base de datos.';
        break;
      case 'SERVER_ERROR':
        heading = 'Servidor Caído';
        message =
          'El sistema central está experimentando fallas temporales. Nuestro equipo ya ha sido notificado.';
        break;
      case 'VALIDATION':
      case 'UNKNOWN':
      default:
        message = error.message || message;
        break;
    }
  } else if (error) {
    message = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-in fade-in duration-500">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-danger/10 mb-6 border border-danger/20">
        {icon}
      </div>

      <h3 className="font-display font-semibold text-2xl text-ink mb-3">{heading}</h3>

      <p className="text-ink-muted max-w-md mx-auto mb-8 leading-relaxed">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-surface-raised border border-line
            text-ink font-mono font-medium hover:text-brand hover:border-brand/40 hover:bg-brand/5
            transition-all duration-200 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar Conexión
        </button>
      )}
    </div>
  );
}

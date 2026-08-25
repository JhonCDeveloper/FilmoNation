/**
 * formatters.ts — Formateadores nativos Intl delegados al motor del navegador.
 *
 * Reglas:
 * - Todos los formatos dependen de Intl, no de librerías externas.
 * - Las instancias se crean una sola vez (módulo-level) para rendimiento máximo.
 * - El locale base es 'es-ES' (español ibérico, fallback internacional).
 */

const LOCALE = 'es-ES';

// ── Números ───────────────────────────────────────────────────────────────────

const integerFmt = new Intl.NumberFormat(LOCALE);
const decimalOneFmt = new Intl.NumberFormat(LOCALE, {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

/** "8,4" en lugar de "8.4" — coma decimal española */
export function fmtRating(value: number): string {
  if (value <= 0) return '—';
  return decimalOneFmt.format(value);
}

/** "12.340" → "12.340 votos" | "1" → "1 voto" | "0" → "Sin votos" */
export function fmtVoteCount(count: number): string {
  const plural = new Intl.PluralRules(LOCALE).select(count);
  if (count === 0) return 'Sin votos';
  const formatted = integerFmt.format(count);
  return plural === 'one' ? `${formatted} voto` : `${formatted} votos`;
}

// ── Moneda ────────────────────────────────────────────────────────────────────

const currencyCompactFmt = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** "$147,5 M" — compacto y localizado */
export function fmtUSD(amount: number): string {
  if (!amount || amount === 0) return 'N/D';
  return currencyCompactFmt.format(amount);
}

// ── Fechas ────────────────────────────────────────────────────────────────────

const yearFmt = new Intl.DateTimeFormat(LOCALE, { year: 'numeric' });
const fullDateFmt = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/** Extrae el año: "2024" */
export function fmtYear(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    // TMDB devuelve "YYYY-MM-DD"; parseamos sin TZ shift
    const [y] = dateStr.split('-');
    return y ?? '—';
  } catch {
    return '—';
  }
}

/** Fecha larga: "15 de marzo de 2024" */
export function fmtFullDate(dateStr: string): string {
  if (!dateStr) return '—';
  try {
    return fullDateFmt.format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}
// Exportar para uso en formatos de año en componentes que solo necesitan el formateador
export { yearFmt };

// ── Duración ──────────────────────────────────────────────────────────────────

/** "1h 58m" | "45m" | "N/D" */
export function fmtRuntime(minutes: number | null | undefined): string {
  if (!minutes || minutes <= 0) return 'N/D';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${String(m)}m`;
  if (m === 0) return `${String(h)}h`;
  return `${String(h)}h ${String(m)}m`;
}

// ── Utilidad: ¿es futura? ─────────────────────────────────────────────────────

/** true si la fecha de lanzamiento es futura o está vacía */
export function isUpcoming(dateStr: string): boolean {
  if (!dateStr) return true;
  try {
    return new Date(dateStr) > new Date();
  } catch {
    return false;
  }
}

/**
 * messages.ts — Catálogo centralizado de literales de interfaz (Single Source of Truth).
 *
 * Reglas:
 * - Ningún string de UI debe vivir suelto en JSX.
 * - Los valores son cadenas puras o funciones que producen cadenas, nunca JSX.
 * - Las cadenas con interpolación reciben un parámetro tipado.
 */

export const UI = {
  // ── Navegación ──────────────────────────────────────────────────────────────
  nav: {
    backToTerritory: 'Volver al territorio',
    territorio: 'Territorio',
    myPassport: 'Mi Pasaporte',
    viewAll: 'Ver todo en territorio →',
  },

  // ── Secciones ────────────────────────────────────────────────────────────────
  sections: {
    trending: 'Tendencias de la semana',
    similarMovies: 'Territorios Similares',
    synopsis: 'Sinopsis del Expediente',
    trailer: 'Registro Audiovisual',
    cast: 'Cuerpo Diplomático',
    admin: 'Ficha Administrativa',
  },

  // ── Búsqueda ─────────────────────────────────────────────────────────────────
  search: {
    placeholder: 'Buscar Territorio...',
    noData: 'Sin dato',
    viewAll: 'Ver todos los resultados en territorio',
    noResults: 'No se encontraron expedientes.',
  },

  // ── Etiquetas de Ficha Técnica ───────────────────────────────────────────────
  adminFields: {
    director: 'Dirección',
    status: 'Estado',
    budget: 'Presupuesto',
    revenue: 'Recaudación',
    votes: 'votos',
    voteCount: (n: number) =>
      n === 0 ? 'Sin votos' : n === 1 ? '1 voto' : `${n.toLocaleString('es-ES')} votos`,
  },

  // ── Estados de Pasaporte ─────────────────────────────────────────────────────
  passport: {
    stamped: 'SELLADA',
    watchlisted: 'VISA PENDIENTE',
    upcoming: 'PRÓXIMO',
  },

  // ── Accesibilidad ────────────────────────────────────────────────────────────
  a11y: {
    /** aria-label completo para una tarjeta de película. */
    movieCard: ({
      title,
      year,
      rating,
      upcoming,
      stamped,
      watchlisted,
    }: {
      title: string;
      year: string;
      rating: string;
      upcoming: boolean;
      stamped: boolean;
      watchlisted: boolean;
    }): string => {
      const parts = [title, year, `${rating} de 10`];
      if (upcoming) parts.push('Próximo estreno');
      if (stamped) parts.push('Sellada');
      else if (watchlisted) parts.push('Visa pendiente');
      return parts.join(', ');
    },

    ratingBadge: (rating: string) => `Calificación: ${rating}`,
    posterAlt: (title: string) => `Póster de ${title}`,
    profileAlt: (name: string) => `Foto de perfil de ${name}`,
    iframeTitle: (movieTitle: string) => `Tráiler oficial de ${movieTitle}`,
  },

  // ── Valoración ───────────────────────────────────────────────────────────────
  rating: {
    unavailable: '—',
    outOf: '/10',
  },

  // ── Sinopsis ─────────────────────────────────────────────────────────────────
  synopsis: {
    unavailable: 'Esta película no tiene sinopsis disponible en este momento.',
    englishNotice: '(Sinopsis en inglés — traducción pendiente)',
  },

  // ── Metadatos ─────────────────────────────────────────────────────────────────
  metadata: {
    unknownYear: '—',
    unknownRuntime: 'N/D',
    unknownAmount: 'N/D',
  },

  // ── Paginación / Vacío / Error ────────────────────────────────────────────────
  state: {
    loading: 'Cargando…',
    retrying: 'Reintentar conexión',
    emptySearch: 'No se encontraron expedientes con los filtros actuales.',
    emptyCatalog: 'El pasaporte aún no tiene sellos. Explora los territorios.',
    rateLimitMsg: 'Demasiadas solicitudes a la base de datos. Intenta en unos segundos.',
    networkMsg: 'Sin conexión. Verifica tu red e inténtalo de nuevo.',
    genericError: 'Algo salió mal. Puedes reintentar o volver al inicio.',
  },
} as const;

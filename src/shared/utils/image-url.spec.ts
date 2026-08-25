import { describe, expect, it } from 'vitest';
import { getTmdbImageUrl } from './image-url';

describe('getTmdbImageUrl', () => {
  it('debería retornar la URL completa con el tamaño w500 por defecto para posters', () => {
    const url = getTmdbImageUrl('/poster.jpg');
    expect(url).toBe('https://image.tmdb.org/t/p/w500/poster.jpg');
  });

  it('debería retornar la URL completa con el tamaño w780 por defecto para backdrops', () => {
    const url = getTmdbImageUrl('/backdrop.jpg', { type: 'backdrop' });
    expect(url).toBe('https://image.tmdb.org/t/p/w780/backdrop.jpg');
  });

  it('debería respetar un tamaño personalizado especificado', () => {
    const url = getTmdbImageUrl('/poster.jpg', { size: 'original' });
    expect(url).toBe('https://image.tmdb.org/t/p/original/poster.jpg');
  });

  it('debería formatear correctamente la ruta si no incluye barra inicial', () => {
    const url = getTmdbImageUrl('poster.jpg');
    expect(url).toBe('https://image.tmdb.org/t/p/w500/poster.jpg');
  });

  it('debería retornar un SVG placeholder cuando path es null o undefined', () => {
    const posterFallback = getTmdbImageUrl(null);
    expect(posterFallback).toContain('data:image/svg+xml');
    expect(posterFallback).toContain('Imagen%20no%20disponible');

    const backdropFallback = getTmdbImageUrl(undefined, { type: 'backdrop' });
    expect(backdropFallback).toContain('data:image/svg+xml');
    expect(backdropFallback).toContain('Sin%20imagen%20de%20fondo');
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App (Smoke Test)', () => {
  it('debería montar el esqueleto de la aplicación y mostrar el encabezado', () => {
    render(<App />);

    const header = screen.getByRole('heading', { name: /filmonation/i });
    expect(header).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '@/presentation/providers/app-providers';
import { StampButton } from './stamp-button';

describe('StampButton', () => {
  it('debería renderizar el botón no sellado por defecto y cambiar a sellado al dar click', async () => {
    const user = userEvent.setup();

    render(
      <AppProviders>
        <StampButton movieId={9999} />
      </AppProviders>,
    );

    const button = screen.getByRole('button', { name: /sellar película en pasaporte/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Sellar');

    await user.click(button);

    expect(screen.getByRole('button', { name: /quitar sello del pasaporte/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /quitar sello del pasaporte/i })).toHaveTextContent(
      'Sellado',
    );
  });
});

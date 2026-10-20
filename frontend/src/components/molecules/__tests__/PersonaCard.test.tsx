import React from 'react';
import { render, screen, fireEvent } from
  '@testing-library/react';
import PersonaCard from '../PersonaCard';
import type { Persona } from '@/types/marketResearch';

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}));

const persona: Persona = {
  id: 'p1', userId: 'u1', name: 'Sam the tradesperson',
  role: 'Owner', painPoints: ['no time'],
  goals: ['more customers'], notes: '',
};

describe('PersonaCard', () => {
  it('opens the persona for editing when clicked', () => {
    const onEdit = jest.fn();
    render(<PersonaCard persona={persona}
      onEdit={onEdit} />);
    fireEvent.click(screen.getByTestId('persona-card-p1'));
    expect(onEdit).toHaveBeenCalledWith(persona);
  });

  it('has no delete button unless asked for one', () => {
    render(<PersonaCard persona={persona}
      onEdit={jest.fn()} />);
    expect(screen.queryByTestId('persona-delete-p1'))
      .toBeNull();
  });

  it('deletes without also opening the editor', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    render(<PersonaCard persona={persona}
      onEdit={onEdit} onDelete={onDelete} />);
    fireEvent.click(screen.getByTestId('persona-delete-p1'));
    expect(onDelete).toHaveBeenCalledWith(persona);
    expect(onEdit).not.toHaveBeenCalled();
  });
});

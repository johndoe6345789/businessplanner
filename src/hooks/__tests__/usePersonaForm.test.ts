import { renderHook, act } from '@testing-library/react';

const createMock = jest.fn();
const updateMock = jest.fn();

jest.mock('@/store/api/marketResearchPersonaApi', () => ({
  useCreatePersonaMutation: () => [createMock],
  useUpdatePersonaMutation: () => [updateMock],
}));

import { usePersonaForm } from '../usePersonaForm';
import type { Persona } from '@/types/marketResearch';

const PERSONA: Persona = {
  id: 'p-1', userId: 'u-1',
  name: 'Alice', role: 'CTO',
  painPoints: ['slow deploys'],
  goals: ['ship faster'],
  notes: 'Early adopter',
};

describe('usePersonaForm', () => {
  beforeEach(() => {
    createMock.mockReset();
    updateMock.mockReset();
  });

  it('initialises empty when no initial persona', () => {
    const { result } = renderHook(() =>
      usePersonaForm(undefined, jest.fn()));
    expect(result.current.name).toBe('');
    expect(result.current.role).toBe('');
    expect(result.current.painPoints).toEqual([]);
    expect(result.current.goals).toEqual([]);
    expect(result.current.notes).toBe('');
  });

  it('pre-fills fields from initial persona', () => {
    const { result } = renderHook(() =>
      usePersonaForm(PERSONA, jest.fn()));
    expect(result.current.name).toBe('Alice');
    expect(result.current.role).toBe('CTO');
    expect(result.current.painPoints).toEqual(['slow deploys']);
    expect(result.current.goals).toEqual(['ship faster']);
    expect(result.current.notes).toBe('Early adopter');
  });

  it('setName updates name', () => {
    const { result } = renderHook(() =>
      usePersonaForm(undefined, jest.fn()));
    act(() => { result.current.setName('Bob'); });
    expect(result.current.name).toBe('Bob');
  });

  it('setPainPoints and setGoals update arrays', () => {
    const { result } = renderHook(() =>
      usePersonaForm(undefined, jest.fn()));
    act(() => {
      result.current.setPainPoints(['no budget']);
      result.current.setGoals(['cut costs']);
    });
    expect(result.current.painPoints).toEqual(['no budget']);
    expect(result.current.goals).toEqual(['cut costs']);
  });

  it('handleSubmit calls create when no initial persona', async () => {
    createMock.mockResolvedValue({});
    const onDone = jest.fn();
    const { result } = renderHook(() =>
      usePersonaForm(undefined, onDone));
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(createMock).toHaveBeenCalled();
    expect(updateMock).not.toHaveBeenCalled();
    expect(onDone).toHaveBeenCalled();
  });

  it('handleSubmit calls update when editing', async () => {
    updateMock.mockResolvedValue({});
    const onDone = jest.fn();
    const { result } = renderHook(() =>
      usePersonaForm(PERSONA, onDone));
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'p-1' }),
    );
    expect(createMock).not.toHaveBeenCalled();
    expect(onDone).toHaveBeenCalled();
  });
});

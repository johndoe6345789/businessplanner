import { renderHook, act } from '@testing-library/react';

const listMock = jest.fn();

jest.mock('@/store/api/marketResearchPersonaApi', () => ({
  useListPersonasQuery: () => listMock(),
}));

import { usePersonaBoard } from '../usePersonaBoard';
import type { Persona } from '@/types/marketResearch';

const PERSONA: Persona = {
  id: 'p1', userId: 'u1', name: 'Alice',
  role: 'Developer', painPoints: ['slow tools'],
  goals: ['ship faster'], notes: 'key user',
};

describe('usePersonaBoard', () => {
  beforeEach(() => {
    listMock.mockReturnValue({
      data: [PERSONA], isLoading: false,
    });
  });

  it('returns personas from the query', () => {
    const { result } = renderHook(() => usePersonaBoard());
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].id).toBe('p1');
  });

  it('dialogOpen starts false', () => {
    const { result } = renderHook(() => usePersonaBoard());
    expect(result.current.dialogOpen).toBe(false);
  });

  it('editing starts undefined', () => {
    const { result } = renderHook(() => usePersonaBoard());
    expect(result.current.editing).toBeUndefined();
  });

  it('openAdd sets dialogOpen and clears editing', () => {
    const { result } = renderHook(() => usePersonaBoard());
    act(() => { result.current.openEdit(PERSONA); });
    act(() => { result.current.openAdd(); });
    expect(result.current.dialogOpen).toBe(true);
    expect(result.current.editing).toBeUndefined();
  });

  it('openEdit sets editing and opens dialog', () => {
    const { result } = renderHook(() => usePersonaBoard());
    act(() => { result.current.openEdit(PERSONA); });
    expect(result.current.dialogOpen).toBe(true);
    expect(result.current.editing).toBe(PERSONA);
  });

  it('setDialogOpen can close the dialog', () => {
    const { result } = renderHook(() => usePersonaBoard());
    act(() => { result.current.openAdd(); });
    act(() => { result.current.setDialogOpen(false); });
    expect(result.current.dialogOpen).toBe(false);
  });

  it('defaults data to [] when query has no data', () => {
    listMock.mockReturnValue({ isLoading: true });
    const { result } = renderHook(() => usePersonaBoard());
    expect(result.current.data).toEqual([]);
  });
});

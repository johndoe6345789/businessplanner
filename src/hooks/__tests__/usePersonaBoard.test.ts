import { renderHook, act } from '@testing-library/react';
import { usePersonaBoard } from '../usePersonaBoard';

const deletePersona = jest.fn();
jest.mock('@/store/api/marketResearchPersonaApi', () => ({
  useListPersonasQuery: () => ({
    data: [{ id: 'p1', name: 'Sam' }], isLoading: false,
  }),
  useDeletePersonaMutation: () => [deletePersona],
}));

describe('usePersonaBoard', () => {
  it('deletes a persona by id', () => {
    const { result } = renderHook(() => usePersonaBoard());
    act(() => result.current.removePersona(
      { id: 'p1', name: 'Sam' } as never));
    expect(deletePersona).toHaveBeenCalledWith('p1');
  });
});

const queryMock = jest.fn();
const createMock = jest.fn();
const updateMock = jest.fn();
const deleteMock = jest.fn();

jest.mock('@/store/api/organisationsApi', () => ({
  useListOrganisationsQuery: () => queryMock(),
  useCreateOrganisationMutation: () => [createMock],
  useUpdateOrganisationMutation: () => [updateMock],
  useDeleteOrganisationMutation: () => [deleteMock],
}));

import { renderHook, act } from '@testing-library/react';
import { useOrganisations } from '../useOrganisations';
import type { Organisation } from '@/types/organisations';

const org: Organisation = {
  id: 'o1', user_id: 'u1', name: 'Acme',
  website: '', description: '', entity_types: [],
  notes: '', created_at: '', updated_at: '',
};

describe('useOrganisations', () => {
  beforeEach(() => {
    queryMock.mockReturnValue({
      data: [org], isLoading: false, isError: false,
    });
    createMock.mockReturnValue({
      unwrap: () => Promise.resolve({}),
    });
    updateMock.mockReturnValue({
      unwrap: () => Promise.resolve({}),
    });
  });

  it('exposes organisation list', () => {
    const { result } = renderHook(
      () => useOrganisations(),
    );
    expect(result.current.data).toHaveLength(1);
  });

  it('openAdd sets editing null and opens dialog', () => {
    const { result } = renderHook(
      () => useOrganisations(),
    );
    act(() => { result.current.openAdd(); });
    expect(result.current.open).toBe(true);
    expect(result.current.editing).toBeNull();
  });

  it('openEdit sets editing org and opens dialog', () => {
    const { result } = renderHook(
      () => useOrganisations(),
    );
    act(() => { result.current.openEdit(org); });
    expect(result.current.editing).toBe(org);
    expect(result.current.open).toBe(true);
  });

  it('handleDelete calls the delete mutation', () => {
    const { result } = renderHook(
      () => useOrganisations(),
    );
    act(() => { result.current.handleDelete('o1'); });
    expect(deleteMock).toHaveBeenCalledWith('o1');
  });
});

const deleteMock = jest.fn();
const queryMock = jest.fn();

jest.mock('@/store/api/marketResearchCompetitorApi', () => ({
  useListCompetitorsQuery: () => queryMock(),
  useDeleteCompetitorMutation: () => [deleteMock],
}));

import { renderHook, act } from '@testing-library/react';
import { useCompetitorTracker } from '../useCompetitorTracker';
import type { Competitor } from '@/types/marketResearch';

const comp: Competitor = {
  id: 'c1', name: 'Acme',
  description: '', website: '',
  strengths: [], weaknesses: [], pricing: '',
  user_id: 'u1',
  created_at: '', updated_at: '',
};

describe('useCompetitorTracker', () => {
  beforeEach(() => {
    queryMock.mockReturnValue({ data: [comp], isLoading: false });
  });

  it('exposes competitors and loading flag', () => {
    const { result } = renderHook(
      () => useCompetitorTracker(),
    );
    expect(result.current.data).toHaveLength(1);
    expect(result.current.isLoading).toBe(false);
  });

  it('openAdd sets editing to undefined and opens dialog', () => {
    const { result } = renderHook(
      () => useCompetitorTracker(),
    );
    act(() => { result.current.openAdd(); });
    expect(result.current.dialogOpen).toBe(true);
    expect(result.current.editing).toBeUndefined();
  });

  it('openEdit sets editing to the competitor', () => {
    const { result } = renderHook(
      () => useCompetitorTracker(),
    );
    act(() => { result.current.openEdit(comp); });
    expect(result.current.editing).toBe(comp);
    expect(result.current.dialogOpen).toBe(true);
  });

  it('handleDelete calls the delete mutation', () => {
    const { result } = renderHook(
      () => useCompetitorTracker(),
    );
    act(() => { result.current.handleDelete('c1'); });
    expect(deleteMock).toHaveBeenCalledWith('c1');
  });
});

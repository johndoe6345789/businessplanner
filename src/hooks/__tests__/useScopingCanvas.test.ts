const queryMock = jest.fn();
const createMock = jest.fn();
const updateMock = jest.fn();
const deleteMock = jest.fn();
const iceComputeMock = jest.fn(
  (d: unknown[]) => d,
);

jest.mock('@/store/api/scopingApi', () => ({
  useListFeaturesQuery: () => queryMock(),
  useCreateFeatureMutation: () => [createMock],
  useUpdateFeatureMutation: () => [updateMock],
  useDeleteFeatureMutation: () => [deleteMock],
}));
jest.mock('../useIceCompute', () => ({
  useIceCompute: (d: unknown[]) => iceComputeMock(d),
}));

import { renderHook, act } from '@testing-library/react';
import { useScopingCanvas } from '../useScopingCanvas';
import type { ScopedFeature } from '@/types/scoping';

const feat: ScopedFeature = {
  id: 'f1', title: 'Login', description: '',
  impact: 8, confidence: 7, ease: 6,
  status: 'backlog', user_id: 'u1',
  created_at: '', updated_at: '',
};

describe('useScopingCanvas', () => {
  beforeEach(() => {
    queryMock.mockReturnValue({
      data: [feat], isLoading: false,
    });
  });

  it('openAdd sets editing undefined and opens dialog', () => {
    const { result } = renderHook(
      () => useScopingCanvas(),
    );
    act(() => { result.current.openAdd(); });
    expect(result.current.dialogOpen).toBe(true);
    expect(result.current.editing).toBeUndefined();
  });

  it('openEdit sets editing to feature', () => {
    const { result } = renderHook(
      () => useScopingCanvas(),
    );
    act(() => { result.current.openEdit(feat); });
    expect(result.current.editing).toBe(feat);
    expect(result.current.dialogOpen).toBe(true);
  });

  it('closeDialog hides dialog', () => {
    const { result } = renderHook(
      () => useScopingCanvas(),
    );
    act(() => { result.current.openAdd(); });
    act(() => { result.current.closeDialog(); });
    expect(result.current.dialogOpen).toBe(false);
  });

  it('handleDelete calls delete mutation', () => {
    const { result } = renderHook(
      () => useScopingCanvas(),
    );
    act(() => { result.current.handleDelete('f1'); });
    expect(deleteMock).toHaveBeenCalledWith('f1');
  });
});

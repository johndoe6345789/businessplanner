import { renderHook, act } from
  '@testing-library/react';

const listMock = jest.fn();
const createMock = jest.fn();
const updateMock = jest.fn();
const removeMock = jest.fn();

jest.mock('@/store/api/acceleratorsApi', () => ({
  useListAcceleratorsQuery: () => listMock(),
  useCreateAcceleratorMutation: () => [createMock],
  useUpdateAcceleratorMutation: () => [updateMock],
  useDeleteAcceleratorMutation: () => [removeMock],
}));

import { useAcceleratorTracker }
  from '../useAcceleratorTracker';

const ok = <T,>(v: T) =>
  ({ unwrap: () => Promise.resolve(v) });

const ACCEL = {
  id: '1', name: 'YC',
  programme_type: 'accelerator' as const,
  website: 'https://yc.com',
  deadline: '2025-03-01',
  status: 'applied' as const,
  notes: 'Applied', equity_pct: 7,
  funding_gbp: 125000,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

describe('useAcceleratorTracker', () => {
  beforeEach(() => {
    listMock.mockReturnValue({
      data: [], isLoading: false, isError: false,
    });
    createMock.mockReset();
    updateMock.mockReset();
    removeMock.mockReset();
  });

  it('openAdd sets open and clears editing', () => {
    const { result } =
      renderHook(() => useAcceleratorTracker());
    act(() => { result.current.openAdd(); });
    expect(result.current.open).toBe(true);
    expect(result.current.editing).toBeNull();
  });

  it('openEdit populates form', () => {
    const { result } =
      renderHook(() => useAcceleratorTracker());
    act(() => { result.current.openEdit(ACCEL); });
    expect(result.current.editing).toBe(ACCEL);
    expect(result.current.form.name).toBe('YC');
  });

  it('handleSave create calls create().unwrap', async () => {
    createMock.mockReturnValue(ok({}));
    const { result } =
      renderHook(() => useAcceleratorTracker());
    act(() => { result.current.openAdd(); });
    await act(async () => { await result.current.handleSave(); });
    expect(createMock).toHaveBeenCalled();
    expect(result.current.open).toBe(false);
  });

  it('handleSave update calls update().unwrap', async () => {
    updateMock.mockReturnValue(ok({}));
    const { result } =
      renderHook(() => useAcceleratorTracker());
    act(() => { result.current.openEdit(ACCEL); });
    await act(async () => { await result.current.handleSave(); });
    expect(updateMock).toHaveBeenCalled();
    expect(result.current.open).toBe(false);
  });

  it('handleSave error sets saveError', async () => {
    createMock.mockReturnValue({
      unwrap: () => Promise.reject(new Error('fail')),
    });
    const { result } =
      renderHook(() => useAcceleratorTracker());
    act(() => { result.current.openAdd(); });
    await act(async () => {
      await result.current.handleSave();
    });
    expect(result.current.saveError).not.toBeNull();
  });

  it('handleDelete calls remove with id', () => {
    removeMock.mockReturnValue({});
    const { result } =
      renderHook(() => useAcceleratorTracker());
    act(() => { result.current.handleDelete('1'); });
    expect(removeMock).toHaveBeenCalledWith('1');
  });
});

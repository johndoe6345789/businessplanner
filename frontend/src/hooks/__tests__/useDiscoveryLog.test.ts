import { renderHook, act } from
  '@testing-library/react';

const listMock = jest.fn();
const deleteMock = jest.fn();

jest.mock(
  '@/store/api/marketResearchDiscoveryApi',
  () => ({
    useListDiscoveryQuery: () => listMock(),
    useDeleteDiscoveryEntryMutation:
      () => [deleteMock],
  }),
);

import { useDiscoveryLog } from '../useDiscoveryLog';

const ENTRIES = [
  {
    id: '1', date: '2024-03-01',
    title: 'Older entry', source: 'web',
    insight: 'insight A', tags: [],
  },
  {
    id: '2', date: '2024-06-15',
    title: 'Newer entry', source: 'interview',
    insight: 'insight B', tags: [],
  },
];

describe('useDiscoveryLog', () => {
  beforeEach(() => {
    listMock.mockReturnValue({
      data: [], isLoading: false,
    });
    deleteMock.mockReset();
  });

  it('returns empty sorted list initially', () => {
    const { result } =
      renderHook(() => useDiscoveryLog());
    expect(result.current.sorted).toEqual([]);
  });

  it('sorts entries newest-first', () => {
    listMock.mockReturnValue({
      data: ENTRIES, isLoading: false,
    });
    const { result } =
      renderHook(() => useDiscoveryLog());
    expect(result.current.sorted[0].id).toBe('2');
    expect(result.current.sorted[1].id).toBe('1');
  });

  it('reflects isLoading from query', () => {
    listMock.mockReturnValue({
      data: [], isLoading: true,
    });
    const { result } =
      renderHook(() => useDiscoveryLog());
    expect(result.current.isLoading).toBe(true);
  });

  it('dialogOpen starts false', () => {
    const { result } =
      renderHook(() => useDiscoveryLog());
    expect(result.current.dialogOpen).toBe(false);
  });

  it('setDialogOpen opens dialog', () => {
    const { result } =
      renderHook(() => useDiscoveryLog());
    act(() => {
      result.current.setDialogOpen(true);
    });
    expect(result.current.dialogOpen).toBe(true);
  });

  it('deleteEntry calls mutation with id', () => {
    const { result } =
      renderHook(() => useDiscoveryLog());
    act(() => {
      result.current.deleteEntry('1');
    });
    expect(deleteMock).toHaveBeenCalledWith('1');
  });
});

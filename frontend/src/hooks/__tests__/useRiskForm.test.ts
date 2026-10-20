import { renderHook, act } from '@testing-library/react';

const createMock = jest.fn();

jest.mock('@/store/api/riskAssessmentApi', () => ({
  useCreateRiskMutation: () => [createMock, { isLoading: false }],
}));

import { useRiskForm } from '../useRiskForm';

describe('useRiskForm', () => {
  beforeEach(() => { createMock.mockReset(); });

  it('initialises with default field values', () => {
    const { result } = renderHook(() => useRiskForm());
    expect(result.current.title).toBe('');
    expect(result.current.category).toBe('market');
    expect(result.current.probability).toBe(3);
    expect(result.current.impact).toBe(3);
    expect(result.current.owner).toBe('');
    expect(result.current.orgId).toBeNull();
  });

  it('setTitle updates title', () => {
    const { result } = renderHook(() => useRiskForm());
    act(() => { result.current.setTitle('Supply risk'); });
    expect(result.current.title).toBe('Supply risk');
  });

  it('setCategory updates category', () => {
    const { result } = renderHook(() => useRiskForm());
    act(() => { result.current.setCategory('financial'); });
    expect(result.current.category).toBe('financial');
  });

  it('setProbability and setImpact update ratings', () => {
    const { result } = renderHook(() => useRiskForm());
    act(() => {
      result.current.setProbability(5);
      result.current.setImpact(1);
    });
    expect(result.current.probability).toBe(5);
    expect(result.current.impact).toBe(1);
  });

  it('setOwner and setOrgId update their fields', () => {
    const { result } = renderHook(() => useRiskForm());
    act(() => {
      result.current.setOwner('Alice');
      result.current.setOrgId('org-123');
    });
    expect(result.current.owner).toBe('Alice');
    expect(result.current.orgId).toBe('org-123');
  });

  it('handleSubmit does nothing when title is blank', async () => {
    const { result } = renderHook(() => useRiskForm());
    const e = { preventDefault: jest.fn() } as unknown as React.FormEvent;
    await act(async () => {
      await result.current.handleSubmit(e);
    });
    expect(createMock).not.toHaveBeenCalled();
  });

  it('handleSubmit calls create and resets title/owner', async () => {
    createMock.mockResolvedValue({});
    const { result } = renderHook(() => useRiskForm());
    act(() => {
      result.current.setTitle('Key risk');
      result.current.setOwner('Bob');
    });
    const e = { preventDefault: jest.fn() } as unknown as React.FormEvent;
    await act(async () => {
      await result.current.handleSubmit(e);
    });
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Key risk', owner: 'Bob' }),
    );
    expect(result.current.title).toBe('');
    expect(result.current.owner).toBe('');
  });

  it('handleSubmit ignores whitespace-only title', async () => {
    const { result } = renderHook(() => useRiskForm());
    act(() => { result.current.setTitle('   '); });
    const e = { preventDefault: jest.fn() } as unknown as React.FormEvent;
    await act(async () => {
      await result.current.handleSubmit(e);
    });
    expect(createMock).not.toHaveBeenCalled();
  });
});

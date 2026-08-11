import { renderHook } from '@testing-library/react';

const risksMock = jest.fn();
const orgsMock = jest.fn();

jest.mock('@/store/api/riskAssessmentApi', () => ({
  useListRisksQuery: () => risksMock(),
}));
jest.mock('@/store/api/organisationsApi', () => ({
  useListOrganisationsQuery: () => orgsMock(),
}));

import { useStartupComparison }
  from '../useStartupComparison';

const ORG_A = { id: 'org-a', name: 'Alpha' };
const ORG_B = { id: 'org-b', name: 'Beta' };

const mkRisk = (id: string, p: number, i: number,
  cat = 'market') => ({
  id, user_id: 'u1', category: cat, title: 'R',
  description: '', probability: p, impact: i,
  risk_score: p * i, mitigation_strategy: '',
  owner: '', status: 'open',
  created_at: '', updated_at: '',
  organisation_id: id.startsWith('b-')
    ? 'org-b' : 'org-a',
});

const empty = () => ({
  data: [], isLoading: false, isError: false,
});

describe('useStartupComparison', () => {
  beforeEach(() => {
    risksMock.mockReturnValue(empty());
    orgsMock.mockReturnValue(empty());
  });

  it('returns empty when no data', () => {
    const { result } =
      renderHook(() => useStartupComparison());
    expect(result.current.profiles).toHaveLength(0);
  });

  it('excludes risks without organisation_id', () => {
    risksMock.mockReturnValue({
      ...empty(), data: [{ ...mkRisk('r1', 3, 3),
        organisation_id: '' }],
    });
    orgsMock.mockReturnValue({ ...empty(),
      data: [ORG_A] });
    const { result } =
      renderHook(() => useStartupComparison());
    expect(result.current.profiles).toHaveLength(0);
  });

  it('sorts ascending by totalScore', () => {
    risksMock.mockReturnValue({ ...empty(), data: [
      { ...mkRisk('b-1', 5, 5),
        organisation_id: 'org-b' },
      { ...mkRisk('a-1', 1, 1),
        organisation_id: 'org-a' },
    ]});
    orgsMock.mockReturnValue({ ...empty(),
      data: [ORG_A, ORG_B] });
    const { result } =
      renderHook(() => useStartupComparison());
    expect(result.current.profiles[0].org.id)
      .toBe('org-a');
  });

  it('sums risk_score for totalScore', () => {
    risksMock.mockReturnValue({ ...empty(), data: [
      { ...mkRisk('a-1', 3, 4),
        organisation_id: 'org-a' },
      { ...mkRisk('a-2', 2, 2),
        organisation_id: 'org-a' },
    ]});
    orgsMock.mockReturnValue({ ...empty(),
      data: [ORG_A] });
    const { result } =
      renderHook(() => useStartupComparison());
    expect(result.current.profiles[0].totalScore)
      .toBe(16);
  });

  it('assigns low level for avg <= 4', () => {
    risksMock.mockReturnValue({ ...empty(), data: [
      { ...mkRisk('a-1', 1, 2),
        organisation_id: 'org-a' },
    ]});
    orgsMock.mockReturnValue({ ...empty(),
      data: [ORG_A] });
    const { result } =
      renderHook(() => useStartupComparison());
    expect(result.current.profiles[0].level)
      .toBe('low');
  });
});

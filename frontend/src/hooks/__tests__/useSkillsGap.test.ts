import { renderHook } from '@testing-library/react';

const selectorMock = jest.fn();

jest.mock('@/store/hooks', () => ({
  useAppSelector: (fn: (s: unknown) => unknown) =>
    selectorMock(fn),
}));

const profileMock = jest.fn();

jest.mock('../useSkillsProfile', () => ({
  useSkillsProfile: () => profileMock(),
}));

jest.mock(
  '@/constants/startup-type-skills.json',
  () => ({
    saas: {
      critical: ['React', 'TypeScript', 'SQL'],
      helpful: ['GraphQL'],
    },
    ecommerce: {
      critical: ['Marketing', 'Shopify'],
      helpful: ['SEO'],
    },
  }),
  { virtual: true },
);

import { useSkillsGap } from '../useSkillsGap';

describe('useSkillsGap', () => {
  beforeEach(() => {
    selectorMock.mockReturnValue(null);
    profileMock.mockReturnValue({
      profile: { skills: [], background: '', role: '' },
    });
  });

  it('returns empty arrays when no slug selected', () => {
    const { result } =
      renderHook(() => useSkillsGap());
    expect(result.current.recommendedSkills)
      .toEqual([]);
    expect(result.current.missingSkills).toEqual([]);
    expect(result.current.strengthSkills).toEqual([]);
  });

  it('returns empty arrays for unknown slug', () => {
    selectorMock.mockReturnValue('unknown-slug');
    const { result } =
      renderHook(() => useSkillsGap());
    expect(result.current.recommendedSkills)
      .toEqual([]);
  });

  it('all skills missing when profile is empty', () => {
    selectorMock.mockReturnValue('saas');
    const { result } =
      renderHook(() => useSkillsGap());
    expect(result.current.recommendedSkills)
      .toEqual(['React', 'TypeScript', 'SQL']);
    expect(result.current.missingSkills)
      .toEqual(['React', 'TypeScript', 'SQL']);
    expect(result.current.strengthSkills).toEqual([]);
  });

  it('identifies matching skills as strengths', () => {
    selectorMock.mockReturnValue('saas');
    profileMock.mockReturnValue({
      profile: {
        skills: ['React', 'typescript'],
        background: '', role: '',
      },
    });
    const { result } =
      renderHook(() => useSkillsGap());
    expect(result.current.strengthSkills)
      .toContain('React');
    expect(result.current.strengthSkills)
      .toContain('TypeScript');
    expect(result.current.missingSkills)
      .toEqual(['SQL']);
  });

  it('comparison is case-insensitive', () => {
    selectorMock.mockReturnValue('saas');
    profileMock.mockReturnValue({
      profile: {
        skills: ['REACT', 'TYPESCRIPT', 'SQL'],
        background: '', role: '',
      },
    });
    const { result } =
      renderHook(() => useSkillsGap());
    expect(result.current.missingSkills).toEqual([]);
    expect(result.current.strengthSkills)
      .toHaveLength(3);
  });
});

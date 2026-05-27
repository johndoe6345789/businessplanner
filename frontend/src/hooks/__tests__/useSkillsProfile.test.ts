import { renderHook, act } from '@testing-library/react';
import { useSkillsProfile } from '../useSkillsProfile';

const KEY = 'launchpad_skills';

describe('useSkillsProfile', () => {
  beforeEach(() => localStorage.clear());

  it('initialises with empty default profile', async () => {
    const { result } = renderHook(() => useSkillsProfile());
    await act(async () => {});
    expect(result.current.profile.skills).toEqual([]);
    expect(result.current.profile.background).toBe('');
  });

  it('restores saved profile from localStorage on mount', async () => {
    const saved = { skills: ['Go'], background: 'dev', role: 'founder' };
    localStorage.setItem(KEY, JSON.stringify(saved));
    const { result } = renderHook(() => useSkillsProfile());
    await act(async () => {});
    expect(result.current.profile.role).toBe('founder');
  });

  it('addSkill appends a new skill', () => {
    const { result } = renderHook(() => useSkillsProfile());
    act(() => { result.current.addSkill('React'); });
    expect(result.current.profile.skills).toContain('React');
  });

  it('addSkill ignores duplicate skills', () => {
    const { result } = renderHook(() => useSkillsProfile());
    act(() => { result.current.addSkill('React'); });
    act(() => { result.current.addSkill('React'); });
    expect(result.current.profile.skills).toHaveLength(1);
  });

  it('addSkill ignores blank input', () => {
    const { result } = renderHook(() => useSkillsProfile());
    act(() => { result.current.addSkill('  '); });
    expect(result.current.profile.skills).toHaveLength(0);
  });

  it('removeSkill removes an existing skill', () => {
    const { result } = renderHook(() => useSkillsProfile());
    act(() => { result.current.addSkill('React'); });
    act(() => { result.current.removeSkill('React'); });
    expect(result.current.profile.skills).toHaveLength(0);
  });

  it('save updates state and persists to localStorage', () => {
    const { result } = renderHook(() => useSkillsProfile());
    const next = { skills: ['TS'], background: 'eng', role: 'cto' };
    act(() => { result.current.save(next); });
    expect(result.current.profile.role).toBe('cto');
    expect(localStorage.getItem(KEY)).toContain('TS');
  });
});

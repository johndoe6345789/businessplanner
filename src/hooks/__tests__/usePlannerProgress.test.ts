import { getPhaseStatus } from '../usePlannerProgress';

// getPhaseStatus thresholds: caution=50 (from planner.json)
// 0 done → todo, all done → complete
// pct >= 50 → in-progress, else → started

describe('getPhaseStatus', () => {
  it('returns todo when done is 0', () => {
    expect(getPhaseStatus(0, 10)).toBe('todo');
  });

  it('returns complete when all steps done', () => {
    expect(getPhaseStatus(5, 5)).toBe('complete');
  });

  it('returns complete when done exceeds total', () => {
    expect(getPhaseStatus(6, 5)).toBe('complete');
  });

  it('returns in-progress when pct >= 50', () => {
    // 5/8 = 62.5% → in-progress
    expect(getPhaseStatus(5, 8)).toBe('in-progress');
  });

  it('returns started when 0 < pct < 50', () => {
    // 2/10 = 20% → started
    expect(getPhaseStatus(2, 10)).toBe('started');
  });

  it('returns started at exactly one step done (non-zero, < 50%)', () => {
    expect(getPhaseStatus(1, 10)).toBe('started');
  });

  it('returns in-progress at exactly 50%', () => {
    expect(getPhaseStatus(5, 10)).toBe('in-progress');
  });

  it('handles single-step phases correctly', () => {
    expect(getPhaseStatus(0, 1)).toBe('todo');
    expect(getPhaseStatus(1, 1)).toBe('complete');
  });
});

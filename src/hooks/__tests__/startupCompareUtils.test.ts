import {
  toRiskLevel,
  RISK_CATEGORIES,
} from '../startupCompareUtils';

describe('RISK_CATEGORIES', () => {
  it('contains all five expected categories', () => {
    expect(RISK_CATEGORIES).toEqual([
      'market', 'financial', 'operational',
      'legal', 'technical',
    ]);
  });
});

describe('toRiskLevel', () => {
  it('returns low when count is 0', () => {
    expect(toRiskLevel(100, 0)).toBe('low');
  });

  it('returns low when average <= 4', () => {
    expect(toRiskLevel(4, 1)).toBe('low');
    expect(toRiskLevel(8, 2)).toBe('low');
  });

  it('returns medium when average > 4 and <= 9', () => {
    expect(toRiskLevel(5, 1)).toBe('medium');
    expect(toRiskLevel(9, 1)).toBe('medium');
    expect(toRiskLevel(18, 2)).toBe('medium');
  });

  it('returns high when average > 9 and <= 15', () => {
    expect(toRiskLevel(10, 1)).toBe('high');
    expect(toRiskLevel(15, 1)).toBe('high');
    expect(toRiskLevel(30, 2)).toBe('high');
  });

  it('returns critical when average > 15', () => {
    expect(toRiskLevel(16, 1)).toBe('critical');
    expect(toRiskLevel(100, 3)).toBe('critical');
  });

  it('boundary: avg exactly 4 is low', () => {
    expect(toRiskLevel(4, 1)).toBe('low');
  });

  it('boundary: avg exactly 9 is medium', () => {
    expect(toRiskLevel(9, 1)).toBe('medium');
  });

  it('boundary: avg exactly 15 is high', () => {
    expect(toRiskLevel(15, 1)).toBe('high');
  });
});

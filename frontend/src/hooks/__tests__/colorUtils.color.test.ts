import { hue, hslToRgb } from '../colorUtils';

describe('hue', () => {
  it('returns 0 for grey', () => {
    expect(hue(128, 128, 128)).toBe(0);
  });

  it('returns 0 for red', () => {
    expect(hue(255, 0, 0)).toBe(0);
  });

  it('returns 120 for green', () => {
    expect(hue(0, 255, 0)).toBe(120);
  });

  it('returns 240 for blue', () => {
    expect(hue(0, 0, 255)).toBe(240);
  });
});

describe('hslToRgb', () => {
  it('returns grey for saturation 0', () => {
    const [r, g, b] = hslToRgb(180, 0, 0.5);
    expect(r).toBe(g);
    expect(g).toBe(b);
  });

  it('converts 0° (red) correctly', () => {
    expect(hslToRgb(0, 1, 0.5)).toEqual([255, 0, 0]);
  });

  it('converts 120° (green) correctly', () => {
    expect(hslToRgb(120, 1, 0.5)).toEqual([0, 255, 0]);
  });

  it('converts 240° (blue) correctly', () => {
    expect(hslToRgb(240, 1, 0.5)).toEqual([0, 0, 255]);
  });
});

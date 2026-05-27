import {
  lin, lum, parseRgb, ratio, hue, hslToRgb,
} from '../colorUtils';

describe('lin', () => {
  it('returns 0 for black channel (0)', () => {
    expect(lin(0)).toBeCloseTo(0);
  });

  it('returns 1 for white channel (255)', () => {
    expect(lin(255)).toBeCloseTo(1);
  });

  it('uses linear segment for small values', () => {
    // 10/255 = 0.039 <= 0.04045 → linear
    expect(lin(10)).toBeCloseTo(10 / 255 / 12.92, 6);
  });

  it('uses gamma curve for larger values', () => {
    expect(lin(128)).toBeGreaterThan(128 / 255 / 12.92);
  });
});

describe('lum', () => {
  it('returns 0 for black', () => {
    expect(lum(0, 0, 0)).toBeCloseTo(0);
  });

  it('returns ~1 for white', () => {
    expect(lum(255, 255, 255)).toBeCloseTo(1, 2);
  });

  it('weights green most heavily', () => {
    const greenOnly = lum(0, 255, 0);
    const redOnly   = lum(255, 0, 0);
    const blueOnly  = lum(0, 0, 255);
    expect(greenOnly).toBeGreaterThan(redOnly);
    expect(redOnly).toBeGreaterThan(blueOnly);
  });
});

describe('parseRgb', () => {
  it('parses rgb() string', () => {
    expect(parseRgb('rgb(10, 20, 30)')).toEqual([10, 20, 30]);
  });

  it('parses rgba() string', () => {
    expect(parseRgb('rgba(255, 0, 128, 0.5)')).toEqual(
      [255, 0, 128],
    );
  });

  it('returns null for non-rgb string', () => {
    expect(parseRgb('#fff')).toBeNull();
    expect(parseRgb('')).toBeNull();
  });
});

describe('ratio', () => {
  it('returns 1 for identical luminances', () => {
    expect(ratio(0.5, 0.5)).toBeCloseTo(1);
  });

  it('returns 21 for black vs white', () => {
    expect(ratio(lum(0, 0, 0), lum(255, 255, 255))).toBeCloseTo(
      21, 0,
    );
  });

  it('is commutative', () => {
    expect(ratio(0.2, 0.8)).toBeCloseTo(ratio(0.8, 0.2), 10);
  });
});

describe('hue', () => {
  it('returns 0 for grey (r=g=b)', () => {
    expect(hue(128, 128, 128)).toBe(0);
  });

  it('returns 0 for pure red', () => {
    expect(hue(255, 0, 0)).toBe(0);
  });

  it('returns 120 for pure green', () => {
    expect(hue(0, 255, 0)).toBe(120);
  });

  it('returns 240 for pure blue', () => {
    expect(hue(0, 0, 255)).toBe(240);
  });
});

describe('hslToRgb', () => {
  it('returns grey for saturation 0', () => {
    const [r, g, b] = hslToRgb(180, 0, 0.5);
    expect(r).toBe(g);
    expect(g).toBe(b);
  });

  it('returns ~[255,0,0] for pure red (hsl 0,1,0.5)', () => {
    const [r, g, b] = hslToRgb(0, 1, 0.5);
    expect(r).toBe(255);
    expect(g).toBe(0);
    expect(b).toBe(0);
  });

  it('returns ~[0,255,0] for pure green (hsl 120,1,0.5)', () => {
    const [r, g, b] = hslToRgb(120, 1, 0.5);
    expect(r).toBe(0);
    expect(g).toBe(255);
    expect(b).toBe(0);
  });
});

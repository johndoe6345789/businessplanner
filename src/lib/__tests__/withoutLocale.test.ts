import { withoutLocale } from '../withoutLocale';

describe('withoutLocale', () => {
  it('drops a leading configured locale', () => {
    expect(withoutLocale('/en/financials/burn'))
      .toBe('/financials/burn');
    expect(withoutLocale('/en')).toBe('/');
  });
  it('leaves paths without a locale alone', () => {
    expect(withoutLocale('/financials/burn'))
      .toBe('/financials/burn');
    expect(withoutLocale('/')).toBe('/');
  });
  it('does not mistake a route that looks like a locale', () => {
    expect(withoutLocale('/ai-docs')).toBe('/ai-docs');
    expect(withoutLocale('/enterprise/x')).toBe('/enterprise/x');
  });
});

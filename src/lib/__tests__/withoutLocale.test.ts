import { withoutLocale } from '../withoutLocale';

// The real routing module pulls in next-intl's ES module build, which jest cannot load.
jest.mock('@/i18n/routing', () => ({
  routing: { locales: ['en', 'de'] },
}));

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

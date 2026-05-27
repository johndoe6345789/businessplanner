import {
  flattenTranslations,
  type TransRow,
} from '../flattenTranslations';

describe('flattenTranslations', () => {
  it('returns empty array for empty input', () => {
    expect(flattenTranslations({})).toEqual([]);
  });

  it('flattens a single-level namespace', () => {
    const rows = flattenTranslations({
      auth: { login: 'Log in', logout: 'Log out' },
    });
    expect(rows).toEqual<TransRow[]>([
      { ns: 'auth', key: 'login',  value: 'Log in' },
      { ns: 'auth', key: 'logout', value: 'Log out' },
    ]);
  });

  it('flattens nested keys with dot notation', () => {
    const rows = flattenTranslations({
      nav: { menu: { home: 'Home', about: 'About' } },
    });
    expect(rows).toContainEqual({
      ns: 'nav', key: 'menu.home', value: 'Home',
    });
    expect(rows).toContainEqual({
      ns: 'nav', key: 'menu.about', value: 'About',
    });
  });

  it('sets ns from the top-level key', () => {
    const rows = flattenTranslations({
      common: { ok: 'OK' },
      errors: { notFound: 'Not found' },
    });
    const nsList = rows.map((r) => r.ns);
    expect(nsList).toContain('common');
    expect(nsList).toContain('errors');
  });

  it('skips non-string leaf values', () => {
    const rows = flattenTranslations({
      ns: {
        text: 'hello',
        num: 42,
        flag: true,
        nul: null,
      } as Record<string, unknown>,
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].value).toBe('hello');
  });

  it('skips top-level values that are not objects', () => {
    const rows = flattenTranslations({
      notAnObject: 'string value',
    } as Record<string, unknown>);
    expect(rows).toEqual([]);
  });

  it('handles deeply nested keys', () => {
    const rows = flattenTranslations({
      a: { b: { c: { d: 'deep' } } },
    });
    expect(rows).toEqual([{
      ns: 'a', key: 'b.c.d', value: 'deep',
    }]);
  });
});

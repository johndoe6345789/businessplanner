import { getSystemPref } from '../themeModeTypes';

const makeMQ = (prefersDark: boolean) =>
  (q: string) => ({
    matches: prefersDark
      && q === '(prefers-color-scheme: dark)',
    media: q,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  });

describe('getSystemPref', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true, value: makeMQ(false),
    });
  });

  it('returns "light" when OS does not prefer dark', () => {
    expect(getSystemPref()).toBe('light');
  });

  it('returns "dark" when matchMedia prefers dark', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true, value: makeMQ(true),
    });
    expect(getSystemPref()).toBe('dark');
  });
});

import {
  IGNORED_TAGS, parseCombo, matchesCombo,
} from '../shortcutParser';

describe('IGNORED_TAGS', () => {
  it('contains INPUT, TEXTAREA, SELECT', () => {
    expect(IGNORED_TAGS.has('INPUT')).toBe(true);
    expect(IGNORED_TAGS.has('TEXTAREA')).toBe(true);
    expect(IGNORED_TAGS.has('SELECT')).toBe(true);
  });

  it('does not contain DIV', () => {
    expect(IGNORED_TAGS.has('DIV')).toBe(false);
  });
});

describe('parseCombo', () => {
  it('parses single key', () => {
    expect(parseCombo('escape')).toEqual({
      ctrl: false, shift: false,
      alt: false, meta: false, key: 'escape',
    });
  });

  it('parses ctrl+shift+d', () => {
    expect(parseCombo('ctrl+shift+d')).toEqual({
      ctrl: true, shift: true,
      alt: false, meta: false, key: 'd',
    });
  });

  it('parses alt+arrowup', () => {
    expect(parseCombo('alt+arrowup')).toEqual({
      ctrl: false, shift: false,
      alt: true, meta: false, key: 'arrowup',
    });
  });

  it('is case-insensitive', () => {
    const a = parseCombo('Ctrl+Shift+K');
    expect(a.ctrl).toBe(true);
    expect(a.shift).toBe(true);
    expect(a.key).toBe('k');
  });

  it('parses meta modifier', () => {
    expect(parseCombo('meta+s').meta).toBe(true);
  });
});

describe('matchesCombo', () => {
  const makeEvent = (
    overrides: Partial<KeyboardEvent>,
  ): KeyboardEvent =>
    ({
      ctrlKey: false, shiftKey: false,
      altKey: false, metaKey: false,
      key: '',
      ...overrides,
    }) as unknown as KeyboardEvent;

  beforeEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Linux x86_64',
      configurable: true,
    });
  });

  it('matches a plain key', () => {
    const e = makeEvent({ key: 'Escape' });
    expect(matchesCombo(e, parseCombo('escape'))).toBe(true);
  });

  it('does not match when modifier missing', () => {
    const e = makeEvent({ key: 'd', ctrlKey: false });
    expect(matchesCombo(e, parseCombo('ctrl+d'))).toBe(false);
  });

  it('matches ctrl+shift+d', () => {
    const e = makeEvent({
      key: 'd', ctrlKey: true, shiftKey: true,
    });
    expect(matchesCombo(e, parseCombo('ctrl+shift+d'))).toBe(true);
  });

  it('does not match wrong key', () => {
    const e = makeEvent({ key: 'x', ctrlKey: true });
    expect(matchesCombo(e, parseCombo('ctrl+d'))).toBe(false);
  });
});

import {
  applyMdAction, isMdActionAmbiguous,
} from './markdownAction';

const CODE = {
  label: 'Code',
  prefix: '```\n',
  suffix: '\n```',
};

function ta(value: string, ss: number, se = ss) {
  return {
    value, selectionStart: ss, selectionEnd: se,
  } as HTMLTextAreaElement;
}

describe('applyMdAction code block', () => {
  it('omits surrounding \\n at start/end of textarea', () => {
    const r = applyMdAction(ta('', 0), CODE);
    expect(r.value).toBe('```\n\n```');
  });

  it('unwraps a fenced block when caret sits in '
    + 'the middle of its content', () => {
    const r = applyMdAction(ta('```\nhello\n```', 5), CODE);
    expect(r.value).toBe('hello');
    expect(r.caretStart).toBe(1);
  });

  it('unwraps fenced block from a selection inside '
    + 'the fences', () => {
    const r = applyMdAction(
      ta('```\nhello\n```', 4, 9), CODE,
    );
    expect(r.value).toBe('hello');
  });

  it('wraps the current line when textarea has '
    + 'one word and no selection', () => {
    const r = applyMdAction(ta('hello', 5), CODE);
    expect(r.value).toBe('```\nhello\n```');
    expect(r.caretStart).toBe(4);
    expect(r.caretEnd).toBe(9);
  });

  it('wraps only the current line in multi-line text',
    () => {
      const r = applyMdAction(ta('hello\nworld', 8), CODE);
      expect(r.value).toBe('hello\n```\nworld\n```');
    });

  it('inserts an empty block on a blank line', () => {
    const r = applyMdAction(ta('hello\n', 6), CODE);
    expect(r.value).toBe('hello\n```\n\n```');
  });

  it('forceInsert overrides auto-wrap-line and '
    + 'inserts an empty block instead', () => {
    const r = applyMdAction(
      ta('hello', 5), CODE, { forceInsert: true },
    );
    expect(r.value).toBe('hello\n```\n\n```');
  });
});

describe('isMdActionAmbiguous', () => {
  const BOLD = { label: 'B', prefix: '**', suffix: '**' };

  it('returns true on non-empty line, no selection, '
    + 'no surrounding fence', () => {
    expect(
      isMdActionAmbiguous(ta('hello', 5), CODE),
    ).toBe(true);
  });

  it('returns false for empty textarea', () => {
    expect(isMdActionAmbiguous(ta('', 0), CODE)).toBe(false);
  });

  it('returns false when a selection is present', () => {
    expect(
      isMdActionAmbiguous(ta('hello', 0, 5), CODE),
    ).toBe(false);
  });

  it('returns false when cursor is inside a fenced block',
    () => {
      expect(
        isMdActionAmbiguous(ta('```\nhello\n```', 5), CODE),
      ).toBe(false);
    });

  it('returns false for inline (non-block) actions', () => {
    expect(
      isMdActionAmbiguous(ta('hello', 5), BOLD),
    ).toBe(false);
  });
});

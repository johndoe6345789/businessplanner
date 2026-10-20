/** Test harness for MarkdownToolbar integration tests. */
import React, { useRef, useState } from 'react';
import { MarkdownToolbar } from './MarkdownToolbar';

/** Controlled textarea wired to a MarkdownToolbar. */
export function Harness({
  initial = '',
}: { initial?: string }) {
  const [value, setValue] = useState(initial);
  const ref = useRef<HTMLTextAreaElement | null>(null);
  return (
    <>
      <MarkdownToolbar textareaRef={ref}
        onChange={setValue} />
      <textarea ref={ref} value={value}
        onChange={(e) => setValue(e.target.value)}
        data-testid="ta" />
    </>
  );
}

/** Focus the textarea and set the selection range. */
export function setSel(
  ta: HTMLTextAreaElement, ss: number, se: number,
) {
  ta.focus();
  ta.setSelectionRange(ss, se);
}

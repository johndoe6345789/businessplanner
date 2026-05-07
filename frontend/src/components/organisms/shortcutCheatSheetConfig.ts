/**
 * Keyboard shortcut section definitions.
 * @module components/organisms/shortcutCheatSheetConfig
 */
import shortcuts from '@/constants/keyboard-shortcuts.json';
import type { ShortcutDef } from '@/lib/shortcutLabel';

/** Valid section key. */
export type SectionKey = 'global' | 'navigation';

/** Re-export for consumers. */
export type { ShortcutDef };

/** Ordered sections for the cheat sheet. */
export const SECTION_KEYS: {
  key: SectionKey;
  data: Record<string, ShortcutDef>;
}[] = [
  {
    key: 'global',
    data: shortcuts.global as Record<string, ShortcutDef>,
  },
  {
    key: 'navigation',
    data: shortcuts.navigation as Record<string, ShortcutDef>,
  },
];

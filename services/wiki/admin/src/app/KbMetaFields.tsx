'use client'

/**
 * KbMetaFields — KB metadata inputs for
 * kb_type, startup_type, stage, and tags.
 */

import type { KbMeta } from '@/hooks/useWikiPage'
import opts from '@/constants/kb-meta-options.json'

interface Props {
  /** Current KB metadata state. */
  meta: KbMeta
  /** Called on any field change. */
  onChange: (next: KbMeta) => void
}

/** Renders four KB metadata form fields. */
export default function KbMetaFields({
  meta, onChange,
}: Props) {
  const set = (patch: Partial<KbMeta>) =>
    onChange({ ...meta, ...patch })

  return (
    <fieldset
      className="kb-meta"
      data-testid="kb-meta-fields"
      aria-label="Knowledge base metadata"
    >
      <legend>KB Metadata</legend>

      <label htmlFor="kb-type">KB Type</label>
      <select
        id="kb-type"
        value={meta.kbType ?? ''}
        onChange={(e) =>
          set({ kbType: e.target.value || null })}
        aria-label="KB type"
        data-testid="kb-meta-type"
      >
        <option value="">Not a KB article</option>
        {opts.kbTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <label htmlFor="kb-startup-type">
        Startup Type
      </label>
      <select
        id="kb-startup-type"
        value={meta.startupType ?? ''}
        onChange={(e) =>
          set({
            startupType: e.target.value || null,
          })}
        aria-label="Startup type"
        data-testid="kb-meta-startup-type"
      >
        <option value="">All types</option>
        {opts.startupTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <label htmlFor="kb-stage">Stage</label>
      <input
        id="kb-stage"
        type="text"
        value={meta.stage ?? ''}
        onChange={(e) =>
          set({ stage: e.target.value || null })}
        aria-label="Stage slug"
        data-testid="kb-meta-stage"
        placeholder="e.g. validate"
      />

      <label htmlFor="kb-tags">
        Tags (comma-separated)
      </label>
      <input
        id="kb-tags"
        type="text"
        value={meta.tags.join(', ')}
        onChange={(e) =>
          set({
            tags: e.target.value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
          })}
        aria-label="Tags"
        data-testid="kb-meta-tags"
        placeholder="e.g. finance, saas"
      />
    </fieldset>
  )
}

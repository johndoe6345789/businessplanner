'use client'

/**
 * useWikiPage — loads a single wiki page and
 * exposes a save helper that PUTs the update.
 */

import {
  useState, useEffect, useCallback,
} from 'react'

const API = '/api/wiki'

/** KB metadata attached to a wiki page. */
export interface KbMeta {
  /** guide|playbook|benchmark|legal|template|checklist */
  kbType: string | null
  /** saas|marketplace|ecommerce|etc */
  startupType: string | null
  stage: string | null
  tags: string[]
}

export interface WikiPage {
  id: number
  parentId: number | null
  slug: string
  title: string
  bodyMd: string
  path: string
  depth: number
  updatedAt: string
  kbType: string | null
  startupType: string | null
  stage: string | null
  tags: string[]
}

/** Fetch + edit a single wiki page. */
export function useWikiPage(
  id: number | null,
): {
  page: WikiPage | null
  save: (
    title: string,
    bodyMd: string,
    kbMeta?: KbMeta,
  ) => Promise<void>
  reload: () => Promise<void>
} {
  const [page, setPage] =
    useState<WikiPage | null>(null)

  const reload = useCallback(async () => {
    if (id === null) {
      setPage(null)
      return
    }
    const r = await fetch(`${API}/pages/${id}`)
    if (!r.ok) return
    setPage((await r.json()) as WikiPage)
  }, [id])

  useEffect(() => { void reload() }, [reload])

  const save = useCallback(
    async (
      title: string,
      bodyMd: string,
      kbMeta?: KbMeta,
    ) => {
      if (id === null) return
      await fetch(`${API}/pages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          bodyMd,
          ...(kbMeta !== undefined && {
            kb_type: kbMeta.kbType,
            startup_type: kbMeta.startupType,
            stage: kbMeta.stage,
            tags: kbMeta.tags,
          }),
        }),
      })
      await reload()
    },
    [id, reload],
  )

  return { page, save, reload }
}

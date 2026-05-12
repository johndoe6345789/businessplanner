# `search.reindex` Kafka event shape

LaunchPad services (startup-types, planner, community,
users) emit JSON messages to the Kafka topic
`search.reindex`. The search-indexer daemon consumes
them and applies upserts / deletes against the
corresponding Elasticsearch index.

## Wire format

```json
{
  "op":    "upsert",
  "index": "kb_content",
  "id":    "42",
  "doc": {
    "kb_type":      "playbook",
    "startup_type": "saas",
    "stage":        "validate",
    "title":        "Finding your first 10 customers",
    "body_md":      "...",
    "tags":         ["gtm", "sales"],
    "updated_at":   "2026-05-12T10:00:00Z"
  }
}
```

Note: `kb_content` is sourced from `wiki_pages` WHERE
`kb_type IS NOT NULL`. The wiki admin panel is the
authoring interface; the search daemon reindexes on the
standard hourly schedule.

## Fields

- `op` — required. One of:
  - `"upsert"` — index or replace the document at `id`.
  - `"delete"` — remove the document at `id`.
- `index` — logical index name. Must match a `name`
  from `services/search/constants.json`:
  `kb_content`, `planner_steps`,
  `community_posts`, `founders`.
- `id` — document id as a **string**. Used verbatim
  as the Elasticsearch `_id`.
- `doc` — required for `upsert`, ignored on `delete`.
  Shape mirrors the per-index mapping in
  `SearchIndexMappings.h`. Unknown fields are ignored.

## Current status

The `KafkaConsumerStub` logs receipts but does not yet
apply them. Boot-time backfill (`reindexAll`) and the
periodic resync timer keep indexes warm. Full event
dispatch lands once Phase 2 (startup-types) and Phase
3 (market-research) producers exist.

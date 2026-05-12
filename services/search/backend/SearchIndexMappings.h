#pragma once
/**
 * @file SearchIndexMappings.h
 * @brief LaunchPad Elasticsearch index mappings
 *        for the 4 content domains indexed by the
 *        search-indexer daemon.
 *
 * Names are kept in lock-step with
 * services/search/constants.json — the indexer
 * reads constants.json at runtime; this header is
 * only consulted at boot to ensure each ES index
 * exists with the correct mapping shape.
 */

#include <nlohmann/json.hpp>
#include <string>
#include <utility>
#include <vector>

namespace services
{

using json = nlohmann::json;

/// One (es-index-name, mappings-doc) pair.
using IndexMapping = std::pair<std::string, json>;

/**
 * @brief Authoritative mappings for the 4
 *        LaunchPad indexes.
 *
 * `text` for searchable prose, `keyword` for
 * IDs/enums/slugs used in filters, `date` for
 * timestamps. Title fields get 2x boost weight
 * via copy_to so callers can boost by field name
 * without duplicating the boost logic everywhere.
 */
inline std::vector<IndexMapping> allIndexMappings()
{
    return {
      // --------------------------------------------------
      // Knowledge base: guides, playbooks, benchmarks.
      // Admin-curated content per startup type.
      // --------------------------------------------------
      // Backed by wiki_pages + 002_kb_metadata cols.
      // Only rows WHERE kb_type IS NOT NULL are indexed.
      {"launchpad-kb",
       {{"properties", {
         {"kb_type",      {{"type", "keyword"}}},
         {"startup_type", {{"type", "keyword"}}},
         {"stage",        {{"type", "keyword"}}},
         {"title",        {{"type", "text"}}},
         {"body_md",      {{"type", "text"}}},
         {"tags",         {{"type", "keyword"}}},
         {"updated_at",   {{"type", "date"}}}
       }}}},
      // --------------------------------------------------
      // Planner steps: dynamic per startup type.
      // Lets founders search for a step by name.
      // --------------------------------------------------
      {"launchpad-planner",
       {{"properties", {
         {"step_id",       {{"type", "keyword"}}},
         {"startup_type",  {{"type", "keyword"}}},
         {"stage",         {{"type", "keyword"}}},
         {"title",         {{"type", "text"}}},
         {"description",   {{"type", "text"}}},
         {"tags",          {{"type", "keyword"}}}
       }}}},
      // --------------------------------------------------
      // Community forum posts + milestone comments.
      // Scoped by startup_type for type-specific boards.
      // --------------------------------------------------
      {"launchpad-community",
       {{"properties", {
         {"target_type",  {{"type", "keyword"}}},
         {"target_id",    {{"type", "keyword"}}},
         {"author_id",    {{"type", "keyword"}}},
         {"startup_type", {{"type", "keyword"}}},
         {"title",        {{"type", "text"}}},
         {"body",         {{"type", "text"}}},
         {"created_at",   {{"type", "date"}}}
       }}}},
      // --------------------------------------------------
      // Founder profiles: username, display name,
      // startup type and current stage — so founders
      // can find peers at the same stage.
      // --------------------------------------------------
      {"launchpad-founders",
       {{"properties", {
         {"username",     {{"type", "text"}}},
         {"display_name", {{"type", "text"}}},
         {"startup_type", {{"type", "keyword"}}},
         {"stage",        {{"type", "keyword"}}},
         {"bio",          {{"type", "text"}}}
       }}}}
    };
}

} // namespace services

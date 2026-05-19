#pragma once
/**
 * @file blog_search_emit.h
 * @brief Tiny helpers that publish search.reindex
 *        events for /api/blog mutations. Header-
 *        only so blog_controller_write.cpp stays
 *        under the 100-LOC cap.
 */

#include "blog/backend/ArticleStore.h"
#include "search/events/SearchEventPublisher.h"

#include <cstdint>
#include <string>

namespace businessplanner::blog
{

/// Emit an upsert event for one article row.
inline void emitArticle(std::int64_t id,
                        const Article& a)
{
    businessplanner::search::SearchEventPublisher::publish(
        "upsert", "articles", std::to_string(id),
        {{"slug", a.slug}, {"title", a.title},
         {"body_md", a.bodyMd},
         {"author_id", a.authorId}});
}

/// Emit a delete event for one article id.
inline void emitArticleDelete(std::int64_t id)
{
    businessplanner::search::SearchEventPublisher
        ::publishDelete("articles",
                        std::to_string(id));
}

} // namespace businessplanner::blog

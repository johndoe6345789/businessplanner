/**
 * @file wiki_store_delete.cpp
 * @brief Delete path for WikiStore.
 */

#include "WikiStore.h"
#include <spdlog/spdlog.h>

namespace services::wiki
{

void WikiStore::deletePage(
    std::int64_t id, Callback ok, ErrCallback err)
{
    static const std::string kDel =
        "DELETE FROM wiki_pages WHERE id = $1";
    *db() << kDel << id >>
        [ok](const drogon::orm::Result&) {
            ok({{"ok", true}});
        } >>
        [err](
            const drogon::orm::
                DrogonDbException& e) {
            spdlog::error("wiki delete: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                "Failed to delete page");
        };
}

} // namespace services::wiki

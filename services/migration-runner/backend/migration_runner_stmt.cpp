/**
 * @file migration_runner_stmt.cpp
 * @brief Single-statement async SQL executor for migrations.
 */

#include "migration-runner/backend/migration_runner_stmt.h"

#include <fmt/format.h>
#include <spdlog/spdlog.h>

namespace services::migrations
{

using namespace drogon;
using namespace drogon::orm;

void applyStmts(
    DbClientPtr db,
    std::vector<std::string> stmts,
    std::size_t idx,
    std::function<void()> onDone,
    services::ErrCallback onError)
{
    if (idx >= stmts.size()) {
        onDone();
        return;
    }

    // execSqlAsync with no extra args — Drogon uses
    // PQsendQuery (simple-query protocol) so each
    // single statement executes without restrictions.
    db->execSqlAsync(
        stmts[idx],
        [db, stmts, idx,
         onDone, onError](const Result&) {
            applyStmts(db, stmts, idx + 1,
                       onDone, onError);
        },
        [idx, onError](
            const DrogonDbException& e) {
            spdlog::error("Stmt {}: {}",
                          idx, e.base().what());
            onError(k500InternalServerError,
                    fmt::format("Statement {}: {}",
                                idx,
                                e.base().what()));
        });
}

} // namespace services::migrations

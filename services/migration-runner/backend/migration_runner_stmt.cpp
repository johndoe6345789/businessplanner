/**
 * @file migration_runner_stmt.cpp
 * @brief Single-statement async SQL executor for migrations.
 */

#include "migration-runner/backend/migration_runner_stmt.h"

#include <fmt/format.h>
#include <spdlog/spdlog.h>

#include <cctype>

namespace services::migrations
{

using namespace drogon;
using namespace drogon::orm;

/**
 * @brief True if @p s is a bare transaction-control word.
 *
 * BEGIN / COMMIT / ROLLBACK / START / END used as standalone
 * statements are meaningless — and harmful — when each
 * statement runs on its own pooled connection and autocommits
 * (a stray BEGIN strands later DDL in a dead transaction).
 */
static bool isTxnCtl(const std::string& s)
{
    std::string w;
    for (const char c : s) {
        if (std::isspace(static_cast<unsigned char>(c))) {
            if (!w.empty()) {
                break;
            }
            continue;
        }
        w += static_cast<char>(
            std::toupper(static_cast<unsigned char>(c)));
    }
    return w == "BEGIN" || w == "COMMIT" || w == "ROLLBACK"
           || w == "START" || w == "END";
}

/**
 * @brief True if @p msg is a benign idempotent-replay error.
 *
 * The legacy users/001 schema and the domain-sliced
 * migrations both CREATE several of the same objects, so
 * "already exists" / duplicate-key errors are expected and
 * safe to skip — the object the migration wanted is present.
 */
static bool isBenignDup(const std::string& msg)
{
    return msg.find("already exists") != std::string::npos
           || msg.find("duplicate key value")
                  != std::string::npos;
}

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

    // Skip per-file BEGIN/COMMIT wrappers: each statement
    // autocommits on a pooled connection, so transaction
    // control here only strands DDL in a dead transaction.
    if (isTxnCtl(stmts[idx])) {
        applyStmts(db, stmts, idx + 1, onDone, onError);
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
        [db, stmts, idx, onDone, onError](
            const DrogonDbException& e) {
            const std::string m = e.base().what();
            if (isBenignDup(m)) {
                spdlog::warn(
                    "Stmt {} idempotent-skip: {}",
                    idx, m);
                applyStmts(db, stmts, idx + 1,
                           onDone, onError);
                return;
            }
            spdlog::error("Stmt {}: {}", idx, m);
            onError(k500InternalServerError,
                    fmt::format("Statement {}: {}",
                                idx, m));
        });
}

} // namespace services::migrations

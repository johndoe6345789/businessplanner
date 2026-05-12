#pragma once
/**
 * @file gdpr_export_helpers.h
 * @brief Internal helpers for GdprExportService:
 *        async query steps that populate a shared
 *        accumulator JSON object.
 */

#include "gdpr_types.h"
#include <memory>
#include <string>

namespace services::gdpr::detail
{

/**
 * @brief Mutable state threaded through query chain.
 */
struct ExportAcc {
    json data;          ///< Accumulated export JSON.
    std::string userId; ///< Target user UUID string.
};

using AccPtr = std::shared_ptr<ExportAcc>;

/**
 * @brief Fetch user profile row into acc->data["user"].
 * @param acc     Shared accumulator.
 * @param next    Called on success to continue chain.
 * @param err     Called on DB error.
 */
void fetchUser(
    AccPtr acc,
    std::function<void()> next,
    ErrCallback err);

/**
 * @brief Fetch market-research tables into
 *        acc->data["market_research"].
 * @param acc     Shared accumulator.
 * @param next    Called on success to continue chain.
 * @param err     Called on DB error.
 */
void fetchMarketResearch(
    AccPtr acc,
    std::function<void()> next,
    ErrCallback err);

/**
 * @brief Fetch financials tables into
 *        acc->data["financials"].
 * @param acc     Shared accumulator.
 * @param next    Called on success to continue chain.
 * @param err     Called on DB error.
 */
void fetchFinancials(
    AccPtr acc,
    std::function<void()> next,
    ErrCallback err);

/**
 * @brief Fetch notifications into
 *        acc->data["notifications"].
 * @param acc     Shared accumulator.
 * @param next    Called on success to continue chain.
 * @param err     Called on DB error.
 */
void fetchNotifications(
    AccPtr acc,
    std::function<void()> next,
    ErrCallback err);

} // namespace services::gdpr::detail

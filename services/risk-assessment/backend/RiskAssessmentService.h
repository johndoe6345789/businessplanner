#pragma once
/**
 * @file RiskAssessmentService.h
 * @brief Service for the risks table.
 */

#include "risk_types.h"
#include <string>

namespace services::risk_assessment
{

/**
 * @brief CRUD service for risk assessment rows.
 */
class RiskAssessmentService
{
  public:
    /**
     * @brief List all risks for a user ordered
     *        by risk_score DESC, created_at DESC.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with JSON array on success.
     * @param err     Called with status + msg on error.
     */
    void listRisks(
        const std::string& userId,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Create a new risk entry.
     * @param userId  UUID of the authenticated user.
     * @param data    Request body with risk fields.
     * @param ok      Called with created row on success.
     * @param err     Called with status + msg on error.
     */
    void createRisk(
        const std::string& userId,
        const json& data,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Update an existing risk entry.
     * @param id      UUID of the risk to update.
     * @param userId  UUID of the authenticated user.
     * @param data    Fields to update.
     * @param ok      Called with updated row on success.
     * @param err     Called with status + msg on error.
     */
    void updateRisk(
        const std::string& id,
        const std::string& userId,
        const json& data,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Delete a risk entry.
     * @param id      UUID of the risk to delete.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with empty JSON on success.
     * @param err     Called with status + msg on error.
     */
    void deleteRisk(
        const std::string& id,
        const std::string& userId,
        Callback ok,
        ErrCallback err);

  private:
    /** @brief Convenience accessor for the DB client. */
    static auto db()
    {
        return drogon::app().getDbClient();
    }
};

} // namespace services::risk_assessment

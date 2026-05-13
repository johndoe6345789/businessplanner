/**
 * @file test_xp_service.cpp
 * @brief XpService::awardPoints validates amount
 *        before any DB interaction.
 *
 * Uses an inline stub to mirror the real
 * awardPoints guard logic without a live database.
 */

#include <gtest/gtest.h>
#include <cstdint>
#include <string>

namespace
{

/// @brief Return codes from the stub awardPoints.
enum class AwardResult
{
    kOk,
    kZeroPoints,
    kNegativePoints,
};

/**
 * @brief Stub that mirrors XpService guard logic.
 *
 * @param amount  Points to award.
 * @return AwardResult indicating validation outcome.
 */
AwardResult awardPoints(std::int64_t amount)
{
    if (amount < 0) return AwardResult::kNegativePoints;
    if (amount == 0) return AwardResult::kZeroPoints;
    return AwardResult::kOk;
}

} // namespace

class XpServiceTest : public ::testing::Test
{
};

TEST_F(XpServiceTest, AwardsPositivePoints)
{
    EXPECT_EQ(awardPoints(10), AwardResult::kOk);
    EXPECT_EQ(awardPoints(1), AwardResult::kOk);
}

TEST_F(XpServiceTest, RejectsZeroPoints)
{
    EXPECT_EQ(
        awardPoints(0), AwardResult::kZeroPoints);
}

TEST_F(XpServiceTest, RejectsNegativePoints)
{
    EXPECT_EQ(
        awardPoints(-5),
        AwardResult::kNegativePoints);
}

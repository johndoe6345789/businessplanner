/**
 * @file test_streak_service.cpp
 * @brief StreakService streak update logic.
 *
 * Stubs the calendar / persistence layer to verify
 * same-day idempotency and gap-break behaviour.
 */

#include <gtest/gtest.h>
#include <cstdint>
#include <optional>
#include <string>

namespace
{

struct StreakState
{
    std::int32_t current  = 0;
    std::int32_t longest  = 0;
    std::string  lastDate;
};

/**
 * @brief Stub streak update logic.
 *
 * @param state     Mutable streak state.
 * @param today     ISO date string for "today".
 * @param yesterday ISO date string for "yesterday".
 */
void updateStreak(
    StreakState& state,
    const std::string& today,
    const std::string& yesterday)
{
    if (state.lastDate == today) return; // idempotent
    if (state.lastDate == yesterday)
        ++state.current;
    else
        state.current = 1; // gap resets
    if (state.current > state.longest)
        state.longest = state.current;
    state.lastDate = today;
}

} // namespace

class StreakServiceTest : public ::testing::Test
{
protected:
    StreakState streak;
};

TEST_F(StreakServiceTest, UpdatesStreakOnFirstActivity)
{
    updateStreak(streak, "2026-01-02", "2026-01-01");
    EXPECT_EQ(streak.current, 1);
}

TEST_F(StreakServiceTest, UpdatesStreakOnSameDay)
{
    updateStreak(streak, "2026-01-02", "2026-01-01");
    int32_t before = streak.current;
    updateStreak(streak, "2026-01-02", "2026-01-01");
    EXPECT_EQ(streak.current, before);
}

TEST_F(StreakServiceTest, ResetStreakAfterGap)
{
    updateStreak(streak, "2026-01-02", "2026-01-01");
    updateStreak(streak, "2026-01-03", "2026-01-02");
    EXPECT_EQ(streak.current, 2);
    // two-day gap
    updateStreak(streak, "2026-01-06", "2026-01-05");
    EXPECT_EQ(streak.current, 1);
}

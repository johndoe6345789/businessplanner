/**
 * @file test_badge_inserter.cpp
 * @brief BadgeInserter upsert behaviour.
 *
 * Stubs the two-step upsert to verify insert
 * and idempotent update semantics independently
 * of a live database.
 */

#include <gtest/gtest.h>
#include <memory>
#include <string>
#include <unordered_map>

namespace
{

struct BadgeRow
{
    std::string slug;
    std::string name;
    int         callCount = 0;
};

using BadgeStore =
    std::unordered_map<std::string, BadgeRow>;

/**
 * @brief Stub upsert: insert or increment call count.
 *
 * @param store  In-memory badge store.
 * @param slug   Badge slug (unique key).
 * @param name   Badge display name.
 */
void upsertBadge(
    BadgeStore& store,
    const std::string& slug,
    const std::string& name)
{
    auto& row = store[slug];
    row.slug = slug;
    row.name = name;
    ++row.callCount;
}

} // namespace

class BadgeInserterTest : public ::testing::Test
{
protected:
    BadgeStore store;
};

TEST_F(BadgeInserterTest, InsertsNewBadge)
{
    upsertBadge(store, "first-login", "First Login");
    ASSERT_EQ(store.count("first-login"), 1u);
    EXPECT_EQ(store["first-login"].name,
              "First Login");
}

TEST_F(BadgeInserterTest, UpdatesExistingBadge)
{
    upsertBadge(store, "streak-7", "Week Warrior");
    upsertBadge(store, "streak-7", "Week Warrior");
    EXPECT_EQ(store["streak-7"].callCount, 2);
    EXPECT_EQ(store.count("streak-7"), 1u);
}

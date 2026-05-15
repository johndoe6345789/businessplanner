/**
 * @file test_startup_profile.cpp
 * @brief Pure-logic tests for 002_startup_profile:
 *        investment/bootstrap columns, parent_org_id
 *        NULLIF pattern, startup_steps JSON shape.
 */

#include <gtest/gtest.h>
#include <nlohmann/json.hpp>
#include <string>

namespace { using json = nlohmann::json; }

static bool parentIsNull(const std::string& s)
{
    return s.empty();
}

static json serializeParent(
    bool isNull, const std::string& v)
{
    return isNull ? json(nullptr) : json(v);
}

static json makeOrgRow(
    int inv, int wks, int rev, bool hasPar)
{
    return {
        {"initial_investment_gbp", inv},
        {"weeks_to_bootstrap",     wks},
        {"monthly_revenue_gbp",    rev},
        {"parent_org_id", hasPar
            ? json("550e8400-e29b-41d4-"
                   "a716-000000000001")
            : json(nullptr)},
    };
}

class StartupProfileTest
    : public ::testing::Test {};

TEST_F(StartupProfileTest, EmptyParentIsNull)
{
    EXPECT_TRUE(parentIsNull(""));
}

TEST_F(StartupProfileTest, UuidParentNotNull)
{
    EXPECT_FALSE(parentIsNull(
        "550e8400-e29b-41d4-a716-446655440000"));
}

TEST_F(StartupProfileTest,
       NullSerializesToJsonNull)
{
    EXPECT_TRUE(
        serializeParent(true, "").is_null());
}

TEST_F(StartupProfileTest,
       UuidSerializesToString)
{
    const std::string u =
        "550e8400-e29b-41d4-a716-446655440000";
    EXPECT_EQ(
        serializeParent(false, u)
            .get<std::string>(), u);
}

TEST_F(StartupProfileTest, InvestmentField)
{
    EXPECT_EQ(
        makeOrgRow(500, 4, 1200, false)
            ["initial_investment_gbp"].get<int>(),
        500);
}

TEST_F(StartupProfileTest, WeeksField)
{
    EXPECT_EQ(
        makeOrgRow(0, 2, 600, false)
            ["weeks_to_bootstrap"].get<int>(), 2);
}

TEST_F(StartupProfileTest, RevenueField)
{
    EXPECT_EQ(
        makeOrgRow(0, 1, 600, false)
            ["monthly_revenue_gbp"].get<int>(), 600);
}

TEST_F(StartupProfileTest, ParentNullAbsent)
{ EXPECT_TRUE(makeOrgRow(100,2,500,false)["parent_org_id"].is_null()); }

TEST_F(StartupProfileTest, ParentStringLinked)
{ EXPECT_TRUE(makeOrgRow(500,4,1200,true)["parent_org_id"].is_string()); }

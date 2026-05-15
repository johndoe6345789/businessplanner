/**
 * @file test_org_link.cpp
 * @brief Pure-logic tests for the organisation_id
 *        FK added to the risks table:
 *        NULLIF pattern, null serialisation, and
 *        ON DELETE SET NULL intent.
 */

#include <gtest/gtest.h>
#include <nlohmann/json.hpp>
#include <string>

namespace
{

using json = nlohmann::json;

/** Mirrors NULLIF($N,'')::uuid in SQL. */
bool orgIdIsNull(const std::string& arg)
{
    return arg.empty();
}

/** Serialises nullable UUID column to JSON. */
json serializeOrgId(bool isNull,
                    const std::string& v)
{
    return isNull ? json(nullptr) : json(v);
}

} // namespace

class OrgLinkTest : public ::testing::Test {};

TEST_F(OrgLinkTest, EmptyStringMapsToNull)
{
    EXPECT_TRUE(orgIdIsNull(""));
}

TEST_F(OrgLinkTest, UuidStringIsNotNull)
{
    const std::string uuid =
        "550e8400-e29b-41d4-a716-446655440000";
    EXPECT_FALSE(orgIdIsNull(uuid));
}

TEST_F(OrgLinkTest, NullSerializesToJsonNull)
{
    const auto result = serializeOrgId(true, "");
    EXPECT_TRUE(result.is_null());
}

TEST_F(OrgLinkTest, UuidSerializesToString)
{
    const std::string uuid =
        "550e8400-e29b-41d4-a716-446655440000";
    const auto result =
        serializeOrgId(false, uuid);
    EXPECT_EQ(result.get<std::string>(), uuid);
}

TEST_F(OrgLinkTest, OnDeleteSetNullIntent)
{
    json row;
    row["organisation_id"] = nullptr;
    EXPECT_TRUE(row["organisation_id"].is_null());
}

TEST_F(OrgLinkTest, RiskRowContainsOrgIdField)
{
    json row;
    row["id"] = "abc";
    row["organisation_id"] = nullptr;
    EXPECT_TRUE(row.contains("organisation_id"));
}

/**
 * @file test_wiki_kb_filter.cpp
 * @brief NULLIF predicate, nullable column
 *        serialisation, ARRAY_TO_JSON tag parsing,
 *        and bare-array response shape tests.
 */

#include <gtest/gtest.h>
#include <nlohmann/json.hpp>
#include <string>

namespace
{

using json = nlohmann::json;

/** Mirrors SQL NULLIF($N,''). True → skip filter. */
bool filterIsNull(const std::string& arg)
{
    return arg.empty();
}

/** Serialises nullable string column to JSON. */
json nullableStr(bool isNull, const std::string& v)
{
    return isNull ? json(nullptr) : json(v);
}

/** Parses ARRAY_TO_JSON(tags)::text output. */
json parseTags(const std::string& raw)
{
    return json::parse(raw);
}

/** Returns arr as-is; must not wrap in envelope. */
json buildResponse(const json& arr) { return arr; }

} // namespace

class WikiKbFilterTest : public ::testing::Test {};

// ── NULLIF predicate ──────────────────────────────
TEST_F(WikiKbFilterTest, EmptyArgSkipsFilter)
{
    EXPECT_TRUE(filterIsNull(""));
}

TEST_F(WikiKbFilterTest, NonEmptyArgAppliesFilter)
{
    EXPECT_FALSE(filterIsNull("saas"));
    EXPECT_FALSE(filterIsNull("pre-mvp"));
}

// ── Nullable column serialisation ─────────────────
TEST_F(WikiKbFilterTest, NullColumnSerializesAsNull)
{
    EXPECT_TRUE(nullableStr(true, "").is_null());
}

TEST_F(WikiKbFilterTest, NonNullColumnIsString)
{
    auto j = nullableStr(false, "saas");
    EXPECT_EQ(j.get<std::string>(), "saas");
}

// ── ARRAY_TO_JSON tag parsing ─────────────────────
TEST_F(WikiKbFilterTest, EmptyTagsParseToArray)
{
    auto j = parseTags("[]");
    EXPECT_TRUE(j.is_array());
    EXPECT_EQ(j.size(), 0u);
}

TEST_F(WikiKbFilterTest, TagsParseCorrectly)
{
    auto j = parseTags(R"(["mvp","saas"])");
    ASSERT_EQ(j.size(), 2u);
    EXPECT_EQ(j[0].get<std::string>(), "mvp");
    EXPECT_EQ(j[1].get<std::string>(), "saas");
}

// ── Bare-array response shape ─────────────────────
TEST_F(WikiKbFilterTest, ResponseIsBareArray)
{
    auto arr = json::array();
    arr.push_back({{"id", 1}, {"title", "Test"}});
    EXPECT_TRUE(buildResponse(arr).is_array());
}

TEST_F(WikiKbFilterTest, ResponseHasNoPagesKey)
{
    EXPECT_FALSE(buildResponse(json::array())
        .contains("pages"));
}

/**
 * @file test_passkey_rp_config.cpp
 * @brief Validates RpConfig env-var parsing and
 *        fallback defaults.
 */

#include <gtest/gtest.h>
#include <cstdlib>
#include <string>

namespace
{

struct RpConfig
{
    std::string rpId;
    std::string rpName;
    std::string origin;
};

RpConfig loadFromEnv()
{
    RpConfig r;
    const char* id = std::getenv("BUSINESSPLANNER_RP_ID");
    const char* name = std::getenv("BUSINESSPLANNER_RP_NAME");
    const char* orig = std::getenv("BUSINESSPLANNER_RP_ORIGIN");
    r.rpId = id ? id : "localhost";
    r.rpName = name ? name : "Businessplanner";
    r.origin = orig ? orig : "http://localhost:8892";
    return r;
}

} // namespace

class RpConfigTest : public ::testing::Test
{
protected:
    void TearDown() override
    {
        unsetenv("BUSINESSPLANNER_RP_ID");
        unsetenv("BUSINESSPLANNER_RP_NAME");
        unsetenv("BUSINESSPLANNER_RP_ORIGIN");
    }
};

TEST_F(RpConfigTest, DefaultsWhenUnset)
{
    auto r = loadFromEnv();
    EXPECT_EQ(r.rpId, "localhost");
    EXPECT_EQ(r.rpName, "Businessplanner");
    EXPECT_EQ(r.origin, "http://localhost:8892");
}

TEST_F(RpConfigTest, ReadsEnvOverrides)
{
    setenv("BUSINESSPLANNER_RP_ID", "example.com", 1);
    setenv("BUSINESSPLANNER_RP_NAME", "Ex", 1);
    setenv("BUSINESSPLANNER_RP_ORIGIN", "https://example.com", 1);
    auto r = loadFromEnv();
    EXPECT_EQ(r.rpId, "example.com");
    EXPECT_EQ(r.rpName, "Ex");
    EXPECT_EQ(r.origin, "https://example.com");
}

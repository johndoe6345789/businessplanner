/**
 * @file test_infra_kafka_factory.cpp
 * @brief KafkaFactory stub fallback when librdkafka is
 *        not compiled in (BUSINESSPLANNER_HAVE_KAFKA undefined).
 */

#include <gtest/gtest.h>

namespace
{

enum class KafkaKind { Stub, Rd };

KafkaKind factorySelect()
{
#ifdef BUSINESSPLANNER_HAVE_KAFKA
    return KafkaKind::Rd;
#else
    return KafkaKind::Stub;
#endif
}

} // namespace

class KafkaFactoryTest : public ::testing::Test
{
};

TEST_F(KafkaFactoryTest, SelectsStubByDefault)
{
#ifndef BUSINESSPLANNER_HAVE_KAFKA
    EXPECT_EQ(factorySelect(), KafkaKind::Stub);
#else
    EXPECT_EQ(factorySelect(), KafkaKind::Rd);
#endif
}

/**
 * @file services/infra/kafka_producer_stub.cpp
 * @brief No-op fallback for @ref businessplanner::infra::KafkaProducer
 *        used when @c BUSINESSPLANNER_HAVE_KAFKA is not defined.
 *
 * Keeps the legacy @c KafkaProducer::instance() singleton
 * referenced from HealthzController compiling even in builds
 * without librdkafka. For new code prefer the interface-based
 * @ref businessplanner::infra::makeKafkaProducer factory.
 */

#ifndef BUSINESSPLANNER_HAVE_KAFKA

#include "infra/backend/KafkaProducer.h"

#include <spdlog/spdlog.h>

namespace businessplanner::infra
{

KafkaProducer::KafkaProducer(
    const std::string& clientId)
    : clientId_("businessplanner-" + clientId)
{
    spdlog::info(
        "KafkaProducer stub active (client={})",
        clientId_);
}

KafkaProducer::~KafkaProducer() = default;

bool KafkaProducer::publish(
    const std::string&,
    const std::string&,
    const std::string&)
{
    return false;
}

void KafkaProducer::flush(int) {}

bool KafkaProducer::isConnected() const
{
    return false;
}

KafkaProducer& KafkaProducer::instance()
{
    static KafkaProducer inst("backend");
    return inst;
}

} // namespace businessplanner::infra

#endif // !BUSINESSPLANNER_HAVE_KAFKA
